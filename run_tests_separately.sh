#!/bin/bash

# CI/CD Script to Run Jest Tests Separately
# This prevents parallel execution issues without modifying test files

set -e  # Exit on any error

echo "🚀 Starting Individual Test Suite Execution..."

# Color codes for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Track results
PASSED_TESTS=()
FAILED_TESTS=()
TOTAL_START_TIME=$(date +%s)

# Function to run a single test file
run_test() {
    local test_file=$1
    local test_name=$(basename "$test_file" .test.js)
    
    echo -e "\n${YELLOW}📝 Running: $test_name${NC}"
    echo "----------------------------------------"
    
    # Set Jest to run only this specific test file with CI-friendly options
    if npx jest "$test_file" \
        --verbose \
        --detectOpenHandles \
        --forceExit \
        --maxWorkers=1 \
        --testTimeout=30000 \
        --no-cache ; then
        
        echo -e "${GREEN}✅ PASSED: $test_name${NC}"
        PASSED_TESTS+=("$test_name")
    else
        echo -e "${RED}❌ FAILED: $test_name${NC}"
        FAILED_TESTS+=("$test_name")
    fi
    
    # Small delay between tests to ensure clean state
    sleep 1
}

# List of test files to run individually
# Add or remove test files as needed
TEST_FILES=(
    "__tests__/simple.test.js"
    "__tests__/utils/RandomGenerator.test.js"
    "__tests__/Header.test.js"
    "__tests__/ResultModal.test.js"
    "__tests__/accessibility.test.js"
    "__tests__/edgecase.test.js"
    "__tests__/SetupForm.test.js"
    "__tests__/SpinnerScreen.simple.test.js"
    "__tests__/SpinnerScreen.integration.test.js"
    "__tests__/App.integration.test.js"
)

echo "Found ${#TEST_FILES[@]} test files to run individually"

# Clear Jest cache before starting
echo "🧹 Clearing Jest cache..."
npx jest --clearCache

# Run each test file separately
for test_file in "${TEST_FILES[@]}"; do
    if [ -f "$test_file" ]; then
        run_test "$test_file"
    else
        echo -e "${RED}⚠️  Test file not found: $test_file${NC}"
        FAILED_TESTS+=("$test_file (not found)")
    fi
done

# Calculate total time
TOTAL_END_TIME=$(date +%s)
TOTAL_DURATION=$((TOTAL_END_TIME - TOTAL_START_TIME))

# Print summary
echo ""
echo "========================================"
echo "🏁 TEST EXECUTION SUMMARY"
echo "========================================"
echo "Total execution time: ${TOTAL_DURATION}s"
echo ""

if [ ${#PASSED_TESTS[@]} -gt 0 ]; then
    echo -e "${GREEN}✅ PASSED TESTS (${#PASSED_TESTS[@]}):${NC}"
    for test in "${PASSED_TESTS[@]}"; do
        echo "  • $test"
    done
    echo ""
fi

if [ ${#FAILED_TESTS[@]} -gt 0 ]; then
    echo -e "${RED}❌ FAILED TESTS (${#FAILED_TESTS[@]}):${NC}"
    for test in "${FAILED_TESTS[@]}"; do
        echo "  • $test"
    done
    echo ""
    echo -e "${RED}💥 Some tests failed! Check the output above for details.${NC}"
    exit 1
else
    echo -e "${GREEN}🎉 All tests passed successfully!${NC}"
    exit 0
fi