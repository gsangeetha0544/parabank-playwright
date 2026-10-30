pipeline {
    agent {
        docker {
            // keep this tag in step with @playwright/test in package.json
            image 'mcr.microsoft.com/playwright:v1.64.1-noble'
            args '--ipc=host'
        }
    }

    environment {
        CI = 'true'
        BASE_URL = 'https://parabank.parasoft.com/parabank/'
    }

    options {
        timestamps()
        timeout(time: 30, unit: 'MINUTES')
        buildDiscarder(logRotator(numToKeepStr: '20'))
    }

    stages {
        stage('Install') {
            steps {
                sh 'npm ci'
            }
        }

        stage('Run tests') {
            steps {
                // headless chromium, retries: 2 comes from playwright.config.ts when CI=true
                sh 'npx playwright test'
            }
        }
    }

    post {
        always {
            allure includeProperties: false, jdk: '', results: [[path: 'allure-results']]
            archiveArtifacts artifacts: 'playwright-report/**', allowEmptyArchive: true
        }
        failure {
            emailext(
                subject: "FAILED: ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                body: """Build ${env.BUILD_NUMBER} of ${env.JOB_NAME} failed.

Console: ${env.BUILD_URL}console
Allure report: ${env.BUILD_URL}allure""",
                recipientProviders: [[$class: 'DevelopersRecipientProvider'], [$class: 'RequesterRecipientProvider']]
            )
        }
    }
}
