# echo "Switching to branch master"
# git checkout master
# git pull

echo "Building app..."
npm run build

echo "Deploying files to server..."
scp -r build/* ubuntu@185.241.192.112:/var/www/185.241.192.112/

echo "Done!"