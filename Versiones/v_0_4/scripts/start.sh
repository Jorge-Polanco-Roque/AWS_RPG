#!/bin/bash

# The Architect's Codex - Start Script
# This script helps you easily start the cosmic horror AWS study game

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# ASCII Art
echo -e "${PURPLE}"
cat << "EOF"
 _____ _            _            _     _ _            _   _       
|_   _| |_ ___     /_\  _ _ __ _| |_ _| |_ ___ __ _ __| |_( )___  
  | | | ' \/ -_)   / _ \| '_/ _| ' \| |  _/ -_) _| |  _|/(_-<  
  |_| |_||_\___|  /_/ \_\_| \__|_||_|_|\__\___\__|_|\__| /__/  
                                                               
   ___              _      ___         _           
  / __|___ ___ _ __ (_)__  / __|___  __| |_____ __ 
 | (__/ _ (_-< '  \| / _| | (__/ _ \/ _` / -_) \ / 
  \___\___/__/_|_|_|_\__|  \___\___/\__,_\___/_\_\ 
                                                   
EOF
echo -e "${NC}"

echo -e "${BLUE}🌌 Welcome to The Architect's Codex - Cosmic Horror AWS Study Game 🌌${NC}"
echo -e "${YELLOW}⚡ The ancient ones await your AWS knowledge...${NC}"
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker is not installed. Please install Docker first.${NC}"
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}❌ Docker Compose is not installed. Please install Docker Compose first.${NC}"
    exit 1
fi

# Function to display menu
show_menu() {
    echo -e "${GREEN}Choose your cosmic deployment:${NC}"
    echo ""
    echo "1. 🚀 Quick Start (Development mode - Port 3030)"
    echo "2. 🏭 Production Deployment (With PostgreSQL & Redis)"
    echo "3. 👨‍💻 Development Mode (With live reload)"
    echo "4. 🔧 Build Only (No start)"
    echo "5. 🛑 Stop All Services"
    echo "6. 🧹 Clean Up (Remove containers and volumes)"
    echo "7. 📊 View Logs"
    echo "8. 🔍 Check Status"
    echo "9. ❌ Exit"
    echo ""
}

# Function to start in development mode
start_development() {
    echo -e "${YELLOW}🔮 Starting development mode...${NC}"
    echo -e "${BLUE}📡 Application will be available at: http://localhost:3030${NC}"
    echo -e "${BLUE}🗄️  PgAdmin will be available at: http://localhost:5050${NC}"
    echo -e "${BLUE}🔴 Redis will be available at: localhost:6379${NC}"
    echo ""
    
    docker-compose -f docker-compose.dev.yml up -d
    
    echo -e "${GREEN}✅ Development environment started successfully!${NC}"
}

# Function to start in production mode
start_production() {
    echo -e "${YELLOW}🌟 Starting production mode...${NC}"
    echo -e "${BLUE}📡 Application will be available at: http://localhost:3030${NC}"
    echo -e "${BLUE}🌐 Nginx will be available at: http://localhost:80${NC}"
    echo ""
    
    # Check if .env file exists
    if [ ! -f .env ]; then
        echo -e "${YELLOW}⚠️  .env file not found. Creating from .env.example...${NC}"
        cp .env.example .env
        echo -e "${RED}🔒 Please edit .env file with your production secrets before continuing!${NC}"
        read -p "Press Enter to continue after editing .env file..."
    fi
    
    docker-compose -f docker-compose.prod.yml up -d
    
    echo -e "${GREEN}✅ Production environment started successfully!${NC}"
}

# Function to quick start
quick_start() {
    echo -e "${YELLOW}🚀 Quick starting the cosmic game...${NC}"
    echo -e "${BLUE}📡 Application will be available at: http://localhost:3030${NC}"
    echo ""
    
    docker-compose up -d architects-codex
    
    echo -e "${GREEN}✅ Quick start completed! The cosmic entities are awakening...${NC}"
}

# Function to build only
build_only() {
    echo -e "${YELLOW}🔨 Building containers...${NC}"
    docker-compose build
    echo -e "${GREEN}✅ Build completed!${NC}"
}

# Function to stop services
stop_services() {
    echo -e "${YELLOW}🛑 Stopping all services...${NC}"
    docker-compose down
    docker-compose -f docker-compose.dev.yml down
    docker-compose -f docker-compose.prod.yml down
    echo -e "${GREEN}✅ All services stopped!${NC}"
}

# Function to clean up
clean_up() {
    echo -e "${YELLOW}🧹 Cleaning up containers and volumes...${NC}"
    echo -e "${RED}⚠️  This will remove all data! Are you sure? (y/N)${NC}"
    read -r response
    if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
        docker-compose down -v
        docker-compose -f docker-compose.dev.yml down -v
        docker-compose -f docker-compose.prod.yml down -v
        docker system prune -f
        echo -e "${GREEN}✅ Cleanup completed!${NC}"
    else
        echo -e "${BLUE}ℹ️  Cleanup cancelled.${NC}"
    fi
}

# Function to view logs
view_logs() {
    echo -e "${YELLOW}📊 Viewing logs...${NC}"
    echo "Choose log source:"
    echo "1. Main application"
    echo "2. Development environment"
    echo "3. Production environment"
    read -p "Enter choice (1-3): " log_choice
    
    case $log_choice in
        1)
            docker-compose logs -f architects-codex
            ;;
        2)
            docker-compose -f docker-compose.dev.yml logs -f
            ;;
        3)
            docker-compose -f docker-compose.prod.yml logs -f
            ;;
        *)
            echo -e "${RED}Invalid choice${NC}"
            ;;
    esac
}

# Function to check status
check_status() {
    echo -e "${YELLOW}🔍 Checking service status...${NC}"
    echo ""
    echo -e "${BLUE}Main Services:${NC}"
    docker-compose ps
    echo ""
    echo -e "${BLUE}Development Services:${NC}"
    docker-compose -f docker-compose.dev.yml ps
    echo ""
    echo -e "${BLUE}Production Services:${NC}"
    docker-compose -f docker-compose.prod.yml ps
}

# Main loop
while true; do
    show_menu
    read -p "Enter your choice (1-9): " choice
    
    case $choice in
        1)
            quick_start
            ;;
        2)
            start_production
            ;;
        3)
            start_development
            ;;
        4)
            build_only
            ;;
        5)
            stop_services
            ;;
        6)
            clean_up
            ;;
        7)
            view_logs
            ;;
        8)
            check_status
            ;;
        9)
            echo -e "${PURPLE}🌌 May your sanity endure the cosmic knowledge! Goodbye!${NC}"
            exit 0
            ;;
        *)
            echo -e "${RED}Invalid choice. Please enter a number between 1-9.${NC}"
            ;;
    esac
    
    echo ""
    echo -e "${BLUE}Press Enter to continue...${NC}"
    read
    clear
done