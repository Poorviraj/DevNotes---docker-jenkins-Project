pipeline {
    agent any

    environment {
        DOCKERHUB_CREDENTIALS = credentials('dockerhub-credentials')
        DOCKERHUB_USERNAME = 'poorviraj'
        APP_SERVER = 'ubuntu@54.173.29.85'
        IMAGE_TAG = "${BUILD_NUMBER}"
    }

    stages {

        stage('Checkout') {
            steps {
                echo 'Cloning repository...'
                checkout scm
            }
        }

        stage('Build Backend Image') {
            steps {
                echo 'Building backend Docker image...'
                sh """
                    docker build \
                        -t ${DOCKERHUB_USERNAME}/devnotes-backend:${IMAGE_TAG} \
                        -t ${DOCKERHUB_USERNAME}/devnotes-backend:latest \
                        ./backend
                """
            }
        }

        stage('Build Frontend Image') {
            steps {
                echo 'Building frontend Docker image...'
                sh """
                    docker build \
                        --build-arg VITE_API_URL=http://54.173.29.85:5000/api \
                        -t ${DOCKERHUB_USERNAME}/devnotes-frontend:${IMAGE_TAG} \
                        -t ${DOCKERHUB_USERNAME}/devnotes-frontend:latest \
                        ./frontend
                """
            }
        }

        stage('Push to Docker Hub') {
            steps {
                echo 'Pushing images to Docker Hub...'
                sh 'echo $DOCKERHUB_CREDENTIALS_PSW | docker login -u $DOCKERHUB_CREDENTIALS_USR --password-stdin'
                sh "docker push ${DOCKERHUB_USERNAME}/devnotes-backend:${IMAGE_TAG}"
                sh "docker push ${DOCKERHUB_USERNAME}/devnotes-backend:latest"
                sh "docker push ${DOCKERHUB_USERNAME}/devnotes-frontend:${IMAGE_TAG}"
                sh "docker push ${DOCKERHUB_USERNAME}/devnotes-frontend:latest"
            }
        }

        stage('Deploy to App Server') {
            steps {
                echo 'Deploying to app server...'
                sshagent(['app-server-ssh']) {
                    sh """
                        scp -o StrictHostKeyChecking=no docker-compose.prod.yml ${APP_SERVER}:~/docker-compose.yml

                        ssh -o StrictHostKeyChecking=no ${APP_SERVER} '
                            echo "Pulling latest images..."
                            docker pull ${DOCKERHUB_USERNAME}/devnotes-backend:latest
                            docker pull ${DOCKERHUB_USERNAME}/devnotes-frontend:latest

                            echo "Stopping old containers..."
                            docker compose down || true

                            echo "Starting new containers..."
                            JWT_SECRET=your_jwt_secret_here docker compose up -d

                            echo "Cleaning up..."
                            docker image prune -f
                        '
                    """
                }
            }
        }

        stage('Health Check') {
            steps {
                echo 'Running health check...'
                sh """
                    sleep 15
                    STATUS=\$(curl -s -o /dev/null -w "%{http_code}" http://54.173.29.85:5000/api/health)
                    if [ \$STATUS -eq 200 ]; then
                        echo "Health check passed!"
                    else
                        echo "Health check failed with status \$STATUS"
                        exit 1
                    fi
                """
            }
        }
    }

    post {
        success {
            echo 'Pipeline completed successfully! App deployed.'
        }
        failure {
            echo 'Pipeline failed! Rolling back...'
            sshagent(['app-server-ssh']) {
                sh """
                    ssh -o StrictHostKeyChecking=no ${APP_SERVER} '
                        docker compose down || true
                        JWT_SECRET=your_jwt_secret_here docker compose up -d
                    '
                """
            }
        }
        always {
            sh 'docker logout'
        }
    }
}