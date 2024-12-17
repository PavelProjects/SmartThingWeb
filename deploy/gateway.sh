GATEWAY_PROJECT_DIR="$HOME/projects/smart_thing/smart_thing_gateway/smart-thing-gateway-app"
STATIC_DIR="$GATEWAY_PROJECT_DIR/src/main/resources/static"

npm run build && \
if [ ! -d "$STATIC_DIR" ]; then
  mkdir $STATIC_DIR
fi && \
rm -rf $STATIC_DIR/* && \
scp -r ./dist/* $STATIC_DIR/ && \
echo "Deployed web content in $STATIC_DIR"
