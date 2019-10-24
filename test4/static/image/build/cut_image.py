import cv2
import numpy as np

path = "timg.jpeg"
image = cv2.imread(path)
image = image[30:-30,:]
cv2.imwrite(path,image)
