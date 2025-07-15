#!/usr/bin/env ts-node

/**
 * E2E Test Runner
 * Comprehensive test runner for all e2e tests with setup and cleanup
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import * as path from 'path';

const execAsync = promisify(exec);

interface TestSuite {
  name: string;
  file: string;
  description: string;
  dependencies?: string[];
}

const testSuites: TestSuite[] = [
  {
    name: 'App',
    file: 'app.e2e-spec.ts',
    description: 'Basic application health checks',
  },
  {
    name: 'Authentication',
    file: 'auth.e2e-spec.ts',
    description: 'Authentication and authorization tests',
  },
  {
    name: 'Masters - Cities',
    file: 'masters-cities.e2e-spec.ts',
    description: 'Cities master data CRUD operations',
    dependencies: ['Authentication'],
  },
  {
    name: 'Builders',
    file: 'builders.e2e-spec.ts',
    description: 'Builders CRUD operations',
    dependencies: ['Authentication'],
  },
  {
    name: 'Agents',
    file: 'agents.e2e-spec.ts',
    description: 'Agents CRUD operations',
    dependencies: ['Authentication'],
  },
  {
    name: 'Projects',
    file: 'projects.e2e-spec.ts',
    description: 'Projects CRUD operations',
    dependencies: ['Authentication', 'Masters - Cities', 'Builders'],
  },
];

class TestRunner {
  private results: Map<string, { success: boolean; duration: number; error?: string }> = new Map();

  async runAllTests(): Promise<void> {
    console.log('🚀 Starting E2E Test Suite');
    console.log('================================');
    
    await this.setupTestEnvironment();
    
    const startTime = Date.now();
    let totalTests = 0;
    let passedTests = 0;
    let failedTests = 0;

    for (const suite of testSuites) {
      console.log(`\n📋 Running: ${suite.name}`);
      console.log(`📝 Description: ${suite.description}`);
      
      if (suite.dependencies) {
        console.log(`🔗 Dependencies: ${suite.dependencies.join(', ')}`);
        
        // Check if dependencies passed
        const dependenciesPassed = suite.dependencies.every(dep => {
          const result = this.results.get(dep);
          return result && result.success;
        });

        if (!dependenciesPassed) {
          console.log(`❌ Skipping ${suite.name} due to failed dependencies`);
          this.results.set(suite.name, { success: false, duration: 0, error: 'Dependencies failed' });
          failedTests++;
          continue;
        }
      }

      const result = await this.runTestSuite(suite);
      this.results.set(suite.name, result);
      
      totalTests++;
      if (result.success) {
        passedTests++;
        console.log(`✅ ${suite.name} passed (${result.duration}ms)`);
      } else {
        failedTests++;
        console.log(`❌ ${suite.name} failed (${result.duration}ms)`);
        if (result.error) {
          console.log(`   Error: ${result.error}`);
        }
      }
    }

    const totalDuration = Date.now() - startTime;
    
    console.log('\n📊 Test Results Summary');
    console.log('========================');
    console.log(`Total Tests: ${totalTests}`);
    console.log(`Passed: ${passedTests}`);
    console.log(`Failed: ${failedTests}`);
    console.log(`Duration: ${totalDuration}ms`);
    console.log(`Success Rate: ${((passedTests / totalTests) * 100).toFixed(2)}%`);

    if (failedTests > 0) {
      console.log('\n❌ Failed Tests:');
      for (const [name, result] of this.results) {
        if (!result.success) {
          console.log(`   - ${name}: ${result.error || 'Unknown error'}`);
        }
      }
      process.exit(1);
    } else {
      console.log('\n🎉 All tests passed!');
      process.exit(0);
    }
  }

  private async setupTestEnvironment(): Promise<void> {
    console.log('🔧 Setting up test environment...');
    
    // Set test environment variables
    process.env.NODE_ENV = 'test';
    process.env.SUPPRESS_LOGS = 'true';
    
    console.log('✅ Test environment ready');
  }

  private async runTestSuite(suite: TestSuite): Promise<{ success: boolean; duration: number; error?: string }> {
    const startTime = Date.now();
    
    try {
      const command = `jest --config ./test/jest-e2e.json --testPathPattern=${suite.file} --verbose --forceExit`;
      const { stdout, stderr } = await execAsync(command, {
        cwd: path.resolve(__dirname, '..'),
        env: { ...process.env, NODE_ENV: 'test' },
      });

      const duration = Date.now() - startTime;
      
      // Check if tests passed (Jest exit code 0)
      return { success: true, duration };
    } catch (error: any) {
      const duration = Date.now() - startTime;
      
      // Extract meaningful error message
      let errorMessage = 'Unknown error';
      if (error.stdout) {
        const lines = error.stdout.split('\n');
        const failureLine = lines.find((line: string) => line.includes('FAIL') || line.includes('Error'));
        if (failureLine) {
          errorMessage = failureLine.trim();
        }
      }
      
      return { success: false, duration, error: errorMessage };
    }
  }

  async runSingleTest(testName: string): Promise<void> {
    const suite = testSuites.find(s => s.name.toLowerCase() === testName.toLowerCase());
    if (!suite) {
      console.log(`❌ Test suite '${testName}' not found`);
      console.log('Available test suites:');
      testSuites.forEach(s => console.log(`   - ${s.name}`));
      process.exit(1);
    }

    console.log(`🚀 Running single test: ${suite.name}`);
    await this.setupTestEnvironment();
    
    const result = await this.runTestSuite(suite);
    
    if (result.success) {
      console.log(`✅ ${suite.name} passed (${result.duration}ms)`);
      process.exit(0);
    } else {
      console.log(`❌ ${suite.name} failed (${result.duration}ms)`);
      if (result.error) {
        console.log(`   Error: ${result.error}`);
      }
      process.exit(1);
    }
  }

  listTests(): void {
    console.log('📋 Available E2E Test Suites:');
    console.log('==============================');
    
    testSuites.forEach((suite, index) => {
      console.log(`${index + 1}. ${suite.name}`);
      console.log(`   📝 ${suite.description}`);
      console.log(`   📁 ${suite.file}`);
      if (suite.dependencies) {
        console.log(`   🔗 Dependencies: ${suite.dependencies.join(', ')}`);
      }
      console.log('');
    });
  }
}

// CLI Interface
async function main() {
  const args = process.argv.slice(2);
  const runner = new TestRunner();

  if (args.length === 0) {
    await runner.runAllTests();
  } else if (args[0] === '--list' || args[0] === '-l') {
    runner.listTests();
  } else if (args[0] === '--test' || args[0] === '-t') {
    if (args[1]) {
      await runner.runSingleTest(args[1]);
    } else {
      console.log('❌ Please specify a test name');
      console.log('Usage: npm run test:e2e:single <test-name>');
      process.exit(1);
    }
  } else {
    console.log('❌ Invalid arguments');
    console.log('Usage:');
    console.log('  npm run test:e2e           # Run all tests');
    console.log('  npm run test:e2e:list      # List available tests');
    console.log('  npm run test:e2e:single <test-name>  # Run single test');
    process.exit(1);
  }
}

if (require.main === module) {
  main().catch(console.error);
}

export { TestRunner, testSuites };
