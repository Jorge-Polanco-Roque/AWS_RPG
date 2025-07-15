#!/bin/bash

# The Architect's Codex - Stop Script
# Gracefully stop all cosmic services

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m'

echo -e "${PURPLE}🌌 Stopping The Architect's Codex Services...${NC}"
echo ""

# Stop local Node.js process
echo -e "${YELLOW}🛑 Stopping local Node.js server...${NC}"
lsof -ti:3030 | xargs kill -9 2>/dev/null || echo -e "${BLUE}ℹ️  No local server running on port 3030${NC}"

# Stop Docker containers
echo -e "${YELLOW}🐳 Stopping Docker containers...${NC}"

docker-compose down 2>/dev/null || echo -e "${BLUE}ℹ️  Main docker-compose not running${NC}"
docker-compose -f docker-compose.backend-only.yml down 2>/dev/null || echo -e "${BLUE}ℹ️  Backend-only not running${NC}"
docker-compose -f docker-compose.dev.yml down 2>/dev/null || echo -e "${BLUE}ℹ️  Development environment not running${NC}"
docker-compose -f docker-compose.prod.yml down 2>/dev/null || echo -e "${BLUE}ℹ️  Production environment not running${NC}"
docker-compose -f docker-compose.simple.yml down 2>/dev/null || echo -e "${BLUE}ℹ️  Simple environment not running${NC}"

echo ""
echo -e "${GREEN}✅ All cosmic services have been stopped!${NC}"
echo -e "${PURPLE}🌙 The ancient ones return to their slumber...${NC}"
echo ""

# Check if anything is still running on port 3030
if lsof -ti:3030 >/dev/null 2>&1; then
    echo -e "${YELLOW}⚠️  Something is still running on port 3030${NC}"
    echo -e "${BLUE}ℹ️  Run: lsof -ti:3030 | xargs kill -9${NC}"
else
    echo -e "${GREEN}🔮 Port 3030 is now free${NC}"
fi