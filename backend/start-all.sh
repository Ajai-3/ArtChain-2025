#!/bin/bash

# Increase open file descriptor limit for all launched services
ulimit -n 65536 2>/dev/null

# Get directory of the script
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$( dirname "$SCRIPT_DIR" )"

# Define colors for output
GREEN='\033[0;32m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${CYAN}🚀 Preparing to launch ArtChain services...${NC}"

# Check for npm
if ! command -v npm &> /dev/null; then
    echo -e "${RED}CRITICAL: npm not found. Please install Node.js.${NC}"
    exit 1
fi

# Define services, paths, and commands (Paths relative to project root)
services=(
    "API Gateway|backend/api-gateway|local"
    "Frontend|frontend|dev"
    "Art Service|backend/services/art-service|local"
    "Chat Service|backend/services/chat-service|dev"
    "Elastic Search Service|backend/services/elastic-search-service|dev"
    "Notification Service|backend/services/notification-service|local"
    "S3 Service|backend/services/s3-service|dev"
    "User Admin Service|backend/services/user-admin-service|local"
    "Wallet Service|backend/services/wallet-service|local"
)

# Function to run in gnome-terminal tabs (standard for Fedora desktop users)
run_in_tabs() {
    echo -e "${GREEN}Detected GNOME Terminal. Launching services in tabs...${NC}"
    
    # Initialize the command string for gnome-terminal
    cmd="gnome-terminal"
    
    for service_info in "${services[@]}"; do
        IFS="|" read -r name path cmd_arg <<< "$service_info"
        full_path="$PROJECT_ROOT/$path"
        
        if [ -d "$full_path" ]; then
            # Chain tabs using --tab
            cmd="$cmd --tab --title=\"$name\" -- bash -c \"cd '$full_path' && npm run $cmd_arg; exec bash\""
        fi
    done
    
    # Execute the gnome-terminal command
    eval "$cmd"
}

# Function to run in background in the current terminal (fallback)
run_in_background() {
    echo -e "${YELLOW}Running services in the background of the current terminal...${NC}"
    pids=()
    
    # Cleanup function
    cleanup() {
        echo -e "\n${RED}🛑 Stopping all services...${NC}"
        for pid in "${pids[@]}"; do
            if kill -0 "$pid" 2>/dev/null; then
                kill "$pid"
            fi
        done
        exit 0
    }
    trap cleanup SIGINT SIGTERM
    
    for service_info in "${services[@]}"; do
        IFS="|" read -r name path cmd_arg <<< "$service_info"
        full_path="$PROJECT_ROOT/$path"
        
        if [ -d "$full_path" ]; then
            echo -e "${GREEN}Starting $name in $path...${NC}"
            # Run npm run and prefix output with the service name
            (cd "$full_path" && npm run "$cmd_arg") 2>&1 | sed "s/^/[ $name ] /" &
            pids+=($!)
        fi
    done
    
    echo -e "${CYAN}Press Ctrl+C to stop all services.${NC}"
    # Wait for all background jobs to finish
    wait
}

# Check if gnome-terminal is installed and we have a display session (X11 or Wayland)
if command -v gnome-terminal &> /dev/null && { [ -n "$DISPLAY" ] || [ -n "$WAYLAND_DISPLAY" ]; }; then
    run_in_tabs
else
    run_in_background
fi
