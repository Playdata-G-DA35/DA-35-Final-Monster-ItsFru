from PIL import Image

# Load the PNG file
img = Image.open(r'C:\final\DA-35-Final-Monster-ItsFru\ItsFru\frontend\public\images\logo-home.png').convert("RGBA")

# Get image data
datas = img.getdata()

# Create a new list to store modified pixel data
new_data = []

for item in datas:
    # Change all non-transparent pixels to white
    if item[3] != 0:  # Check if pixel is not transparent
        new_data.append((255, 255, 255, item[3]))  # Change to white, keep the same alpha
    else:
        new_data.append(item)  # Keep transparent pixels unchanged

# Update image data
img.putdata(new_data)

# Save the modified image
img.save(r"C:\final\DA-35-Final-Monster-ItsFru\ItsFru\frontend\public\images\logo-home.png")