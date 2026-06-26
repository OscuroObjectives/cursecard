import cv2

# -------------------------
# Load Images
# -------------------------

master = cv2.imread("master.jpg", cv2.IMREAD_GRAYSCALE)
test = cv2.imread("uploads/test.jpeg", cv2.IMREAD_GRAYSCALE)

if master is None:
    print("Could not find master.jpg")
    quit()

if test is None:
    print("Could not find test.jpg")
    quit()

# -------------------------
# Create ORB Detector
# -------------------------

orb = cv2.ORB_create(1000)

kp1, des1 = orb.detectAndCompute(master, None)
kp2, des2 = orb.detectAndCompute(test, None)

if des1 is None or des2 is None:

    print("IMAGE REJECTED")
    quit()

# -------------------------
# Match Features
# -------------------------

bf = cv2.BFMatcher(cv2.NORM_HAMMING, crossCheck=True)

matches = bf.match(des1, des2)

matches = sorted(matches, key=lambda x: x.distance)

good_matches = []

for match in matches:

    if match.distance < 55:

        good_matches.append(match)

print("Good Matches:", len(good_matches))

# -------------------------
# Threshold
# -------------------------

THRESHOLD = 60

if len(good_matches) >= THRESHOLD:

    print()
    print("CURSE CARD VERIFIED")

else:

    print()
    print("IMAGE REJECTED")

# -------------------------
# Optional Visualization
# -------------------------

result = cv2.drawMatches(
    master,
    kp1,
    test,
    kp2,
    good_matches[:40],
    None,
    flags=2
)