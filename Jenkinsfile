pipeline{
    agent any
    
    stages{
        stage("ckeckout"){
                steps{
                    git branch: 'main' ,  url: 'https://github.com/Varshith-Yadav/LLM-As-Service.git'
                }
        }
        stage("build"){
            steps {
                // Build the Docker image
                sh """
                docker build -t ${DOCKER_REGISTRY}/${IMAGE_NAME}:${IMAGE_TAG} \
                             -t ${DOCKER_REGISTRY}/${IMAGE_NAME}:latest .
                """
                echo "Docker image built successfully"
            }
            
        }
    }
    
}