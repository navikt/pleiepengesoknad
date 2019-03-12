if [ "$BUILD_ENV" = "heroku-web" ]; then
    echo "Running 'npm run build' for deploying 'heroku-web'"
    npm run build
else
    exit 1
fi
