
import { execSync } from 'child_process';

const testCommand = process.argv.slice(2).join(' ');

if (!testCommand) {
  console.error('Please provide a Playwright test command.');
  process.exit(1);
}

let testExitCode = 0;

try {
  console.log('\nExecuting Playwright tests...\n');

  execSync(`npx playwright test ${testCommand}`, {
    stdio: 'inherit',
  });

} catch (error: any) {
  testExitCode = error.status ?? 1;

} finally {
  console.log('\nGenerating Allure Report...\n');

  try {
    execSync(
      'npx allure generate allure-results --clean -o allure-report',
      { stdio: 'inherit' }
    );

    console.log('\nAllure report generated successfully!');
    console.log('Report location: allure-report/index.html');

  } catch (error: any) {
    console.error('Failed to generate Allure Report.');

    if (testExitCode === 0) {
      testExitCode = error.status ?? 1;
    }
  }
}

process.exit(testExitCode);
