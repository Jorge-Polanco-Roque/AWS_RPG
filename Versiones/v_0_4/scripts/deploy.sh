#!/bin/bash

# The Architect's Codex - Production Deployment Script
# Automated deployment with health checks and rollback capabilities

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m'

# Configuration
APP_NAME="architects-codex"
BACKUP_DIR="./backups"
HEALTH_CHECK_URL="http://localhost:3030/api/game/cosmic-entities"
MAX_HEALTH_CHECKS=30
HEALTH_CHECK_INTERVAL=5

# Functions
log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

log_cosmic() {
    echo -e "${PURPLE}🌌 $1${NC}"
}

# Pre-deployment checks
pre_deployment_checks() {
    log_info "Running pre-deployment checks..."
    
    # Check Docker
    if ! command -v docker &> /dev/null; then
        log_error "Docker is not installed"
        exit 1
    fi
    
    # Check Docker Compose
    if ! command -v docker-compose &> /dev/null; then
        log_error "Docker Compose is not installed"
        exit 1
    fi
    
    # Check .env file
    if [ ! -f .env ]; then
        log_warning ".env file not found. Creating from .env.example..."
        cp .env.example .env
        log_error "Please configure .env file with production values before deployment!"
        exit 1
    fi
    
    # Check required directories
    mkdir -p data logs ssl backups
    
    log_success "Pre-deployment checks passed"
}

# Backup current state
backup_current_state() {
    log_info "Creating backup of current state..."
    
    local backup_timestamp=$(date +"%Y%m%d_%H%M%S")
    local backup_path="$BACKUP_DIR/backup_$backup_timestamp"
    
    mkdir -p "$backup_path"
    
    # Backup database
    if docker ps | grep -q "architects-codex-db"; then
        docker exec architects-codex-db pg_dump -U cosmic_user cosmic_codex > "$backup_path/database.sql"
        log_success "Database backed up to $backup_path/database.sql"
    fi
    
    # Backup volumes
    if [ -d "./data" ]; then
        cp -r ./data "$backup_path/"
        log_success "Data directory backed up"
    fi
    
    # Backup configuration
    cp .env "$backup_path/" 2>/dev/null || true
    cp docker-compose.prod.yml "$backup_path/" 2>/dev/null || true
    
    echo "$backup_timestamp" > .last_backup
    log_success "Backup completed: $backup_path"
}

# Health check function
health_check() {
    local url=$1
    local max_attempts=$2
    local interval=$3
    
    log_info "Performing health checks on $url..."
    
    for i in $(seq 1 $max_attempts); do
        if curl -f -s "$url" > /dev/null 2>&1; then
            log_success "Health check passed (attempt $i/$max_attempts)"
            return 0
        fi
        
        log_warning "Health check failed (attempt $i/$max_attempts), retrying in ${interval}s..."
        sleep $interval
    done
    
    log_error "Health check failed after $max_attempts attempts"
    return 1
}

# Deploy application
deploy_application() {
    log_cosmic "Deploying The Architect's Codex..."
    
    # Pull latest images
    log_info "Pulling latest images..."
    docker-compose -f docker-compose.prod.yml pull
    
    # Build application
    log_info "Building application..."
    docker-compose -f docker-compose.prod.yml build
    
    # Start services
    log_info "Starting services..."
    docker-compose -f docker-compose.prod.yml up -d
    
    # Wait for services to be ready
    log_info "Waiting for services to start..."
    sleep 10
    
    # Perform health check
    if health_check "$HEALTH_CHECK_URL" $MAX_HEALTH_CHECKS $HEALTH_CHECK_INTERVAL; then
        log_success "Deployment successful!"
        return 0
    else
        log_error "Deployment failed health checks"
        return 1
    fi
}

# Rollback function
rollback() {
    log_warning "Initiating rollback..."
    
    if [ ! -f .last_backup ]; then
        log_error "No backup found for rollback"
        exit 1
    fi
    
    local backup_timestamp=$(cat .last_backup)
    local backup_path="$BACKUP_DIR/backup_$backup_timestamp"
    
    if [ ! -d "$backup_path" ]; then
        log_error "Backup directory not found: $backup_path"
        exit 1
    fi
    
    # Stop current services
    docker-compose -f docker-compose.prod.yml down
    
    # Restore database
    if [ -f "$backup_path/database.sql" ]; then
        log_info "Restoring database..."
        docker-compose -f docker-compose.prod.yml up -d postgres
        sleep 10
        docker exec -i architects-codex-db psql -U cosmic_user cosmic_codex < "$backup_path/database.sql"
    fi
    
    # Restore data
    if [ -d "$backup_path/data" ]; then
        log_info "Restoring data directory..."
        rm -rf ./data
        cp -r "$backup_path/data" ./
    fi
    
    # Restore configuration
    if [ -f "$backup_path/.env" ]; then
        cp "$backup_path/.env" ./
    fi
    
    # Start services
    docker-compose -f docker-compose.prod.yml up -d
    
    if health_check "$HEALTH_CHECK_URL" $MAX_HEALTH_CHECKS $HEALTH_CHECK_INTERVAL; then
        log_success "Rollback completed successfully"
    else
        log_error "Rollback failed"
        exit 1
    fi
}

# Cleanup old backups
cleanup_old_backups() {
    log_info "Cleaning up old backups (keeping last 5)..."
    
    if [ -d "$BACKUP_DIR" ]; then
        cd "$BACKUP_DIR"
        ls -t | tail -n +6 | xargs -r rm -rf
        cd ..
        log_success "Old backups cleaned up"
    fi
}

# Show deployment status
show_status() {
    log_cosmic "The Architect's Codex Deployment Status"
    echo ""
    
    log_info "Service Status:"
    docker-compose -f docker-compose.prod.yml ps
    echo ""
    
    log_info "Health Check:"
    if curl -f -s "$HEALTH_CHECK_URL" > /dev/null 2>&1; then
        log_success "Application is healthy: $HEALTH_CHECK_URL"
    else
        log_error "Application health check failed: $HEALTH_CHECK_URL"
    fi
    echo ""
    
    log_info "Access URLs:"
    echo "  🌌 Main Application: http://localhost:3030"
    echo "  🌐 Nginx (if configured): http://localhost:80"
    echo "  📊 Database: localhost:5432"
    echo "  🔴 Redis: localhost:6379"
}

# Main deployment logic
main() {
    echo -e "${PURPLE}"
    cat << "EOF"
  ____             _                                  _   
 |  _ \  ___ _ __ | | ___  _   _ _ __ ___   ___ _ __ | |_ 
 | | | |/ _ \ '_ \| |/ _ \| | | | '_ ` _ \ / _ \ '_ \| __|
 | |_| |  __/ |_) | | (_) | |_| | | | | | |  __/ | | |_ 
 |____/ \___| .__/|_|\___/ \__, |_| |_| |_|\___|_| |_\__|
            |_|           |___/                         
EOF
    echo -e "${NC}"
    
    case "${1:-deploy}" in
        "deploy")
            pre_deployment_checks
            backup_current_state
            if deploy_application; then
                cleanup_old_backups
                show_status
                log_cosmic "The cosmic entities have been successfully summoned!"
            else
                log_error "Deployment failed. Consider running: $0 rollback"
                exit 1
            fi
            ;;
        "rollback")
            rollback
            ;;
        "status")
            show_status
            ;;
        "backup")
            backup_current_state
            ;;
        "health")
            health_check "$HEALTH_CHECK_URL" 1 0
            ;;
        *)
            echo "Usage: $0 {deploy|rollback|status|backup|health}"
            echo ""
            echo "Commands:"
            echo "  deploy   - Deploy the application (default)"
            echo "  rollback - Rollback to previous version"
            echo "  status   - Show deployment status"
            echo "  backup   - Create backup only"
            echo "  health   - Run health check"
            exit 1
            ;;
    esac
}

# Run main function with all arguments
main "$@"