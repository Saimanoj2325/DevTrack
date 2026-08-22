pipeline {
    agent any

    tools {
        nodejs 'NodeJS 20'
    }

    environment {
        NODE_ENV = 'test'
        DATABASE_URL = 'postgresql://devtrack:devtrack_password@localhost:5432/devtrack_db?schema=public'
        JWT_SECRET = 'jenkins-ci-secret-key'
    }

    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out source repository...'
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                echo 'Installing Backend and Frontend dependencies...'
                dir('backend') {
                    sh 'npm ci'
                }
                dir('frontend') {
                    sh 'npm ci'
                }
            }
        }

        stage('Backend Tests') {
            steps {
                echo 'Running Backend automated unit/integration tests...'
                dir('backend') {
                    sh 'npm test'
                }
            }
        }

        stage('Frontend Tests') {
            steps {
                echo 'Running Frontend automated unit tests...'
                dir('frontend') {
                    sh 'npm test'
                }
            }
        }

        stage('Backend Build') {
            steps {
                echo 'Building Backend TypeScript application...'
                dir('backend') {
                    sh 'npm run build'
                }
            }
        }

        stage('Frontend Build') {
            steps {
                echo 'Building Frontend React Vite bundle...'
                dir('frontend') {
                    sh 'npm run build'
                }
            }
        }

        stage('Docker Build') {
            steps {
                echo 'Building Docker containers...'
                sh 'docker compose build || docker build -t devtrack-backend ./backend && docker build -t devtrack-frontend ./frontend || echo "Docker build skipped"'
            }
        }
    }

    post {
        always {
            echo 'Pipeline execution finished.'
        }
        success {
            echo 'DevTrack CI/CD Pipeline completed successfully!'
        }
        failure {
            echo 'DevTrack CI/CD Pipeline failed during execution.'
        }
    }
}
