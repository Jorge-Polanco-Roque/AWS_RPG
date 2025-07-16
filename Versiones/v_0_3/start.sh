#!/bin/bash

# The Architect's Codex - Simple Start Script
# Quick start for the cosmic horror AWS study game

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m'

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

echo -e "${BLUE}🌌 Starting The Architect's Codex - Cosmic Horror AWS Study Game 🌌${NC}"
echo -e "${YELLOW}⚡ The ancient ones are awakening...${NC}"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed. Please install Node.js first.${NC}"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm is not installed. Please install npm first.${NC}"
    exit 1
fi

# Create required directories
echo -e "${YELLOW}🔮 Creating cosmic directories...${NC}"
mkdir -p data logs

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}📦 Installing cosmic dependencies...${NC}"
    npm install
fi

# Kill any existing process on port 3030
echo -e "${YELLOW}🧹 Clearing the cosmic void on port 3030...${NC}"
lsof -ti:3030 | xargs kill -9 2>/dev/null || true

# Start the server
echo -e "${GREEN}🚀 Starting the cosmic server...${NC}"
echo -e "${BLUE}📡 Server will be available at: http://localhost:3030${NC}"
echo -e "${BLUE}🌌 The cosmic entities await your AWS knowledge...${NC}"
echo ""

# Start the server
node src/server/index.js &
SERVER_PID=$!

# Wait a moment for server to start
sleep 3

# Check if server started successfully
if kill -0 $SERVER_PID 2>/dev/null; then
    echo -e "${GREEN}✅ Server started successfully!${NC}"
    echo -e "${BLUE}🌐 Open your browser and go to: http://localhost:3030${NC}"
    echo -e "${YELLOW}⚠️  Press Ctrl+C to stop the server${NC}"
    echo ""
    
    # Test the API
    if curl -s http://localhost:3030/api/game/cosmic-entities > /dev/null; then
        echo -e "${GREEN}🎮 API is responding correctly!${NC}"
        echo -e "${PURPLE}🌌 The cosmic realm is ready for your journey...${NC}"
    else
        echo -e "${YELLOW}⚠️  API might still be starting up...${NC}"
    fi
    
    # Wait for the server process
    wait $SERVER_PID
else
    echo -e "${RED}❌ Failed to start the server${NC}"
    exit 1
fi