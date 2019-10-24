import cv2
import numpy as np

path = "level_fire_1.png"
image = cv2.imread(path)
trans_image = cv2.transpose(image)
new_image = cv2.flip(trans_image,0)
cv2.imwrite("level_fire_9.png",new_image)
