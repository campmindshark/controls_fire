echo 113 > /sys/class/gpio/export
cd /sys/class/gpio/gpio113/
echo out > direction
echo 0 > value
