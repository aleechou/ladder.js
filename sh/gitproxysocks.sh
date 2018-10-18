echo ">>>>" $1 $2
exec /usr/bin/nc -X 5 -x 127.0.0.1:1080 $1 $2