import numpy as np
import cv2

path = "monster.jpg"
image = cv2.imread(path)
image = image[:,::-1]
cv2.imwrite(path,image.astype('uint8'))
