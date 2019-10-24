import cv2
import numpy as np

path = "level_firing_1.png"
image = cv2.imread(path)
image = image[10:-10,:]
cv2.imwrite("test.png",image)
