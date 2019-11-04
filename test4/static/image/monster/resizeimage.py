import numpy as np
import cv2

path = "monster.png"
image = cv2.imread(path)
img = image[20:130,20:140]
cv2.imwrite(path,img.astype(np.uint8))
