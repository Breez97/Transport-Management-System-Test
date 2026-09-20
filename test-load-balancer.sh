echo "Test using frontend"

for i in {1..3}; do
  curl -k https://localhost:3443/api/v1/system/instance
  echo
done

echo
echo "Test using load balancer"

for i in {1..3}; do
  curl http://localhost:8080/api/v1/system/instance
  echo
done

echo
echo "Test directly to backend-1"

for i in {1..3}; do
  curl http://localhost:8081/api/v1/system/instance
  echo
done

echo
echo "Test directly to backend-2"

for i in {1..3}; do
  curl http://localhost:8082/api/v1/system/instance
  echo
done