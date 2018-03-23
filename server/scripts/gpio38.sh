echo 38 > /sys/class/gpio/export
cd /Users/tushar/Documents/MindShark/controls_fire/mock_gpio/sys/class/gpio/gpio38/
echo out > direction
echo 0 > value