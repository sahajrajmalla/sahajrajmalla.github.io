# Deploy to GitHub Pages
.PHONY: deploy
deploy:
	@echo "Building and deploying to GitHub Pages..."
	npm run build
	npm run deploy
