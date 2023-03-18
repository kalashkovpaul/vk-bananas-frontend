echo "Switching to branch master"
git checkout master
git pull

echo "Building app..."
npm run build

echo "Deploying files to server..."
scp -r build/* root@85.192.32.104:/var/www/85.192.32.104/

echo "Done!"