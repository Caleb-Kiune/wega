# Wega Kitchenware Cloudinary Image Mapping
# This file maps local image filenames to Cloudinary URLs for the 56 products

# Cloudinary base URL for your account
CLOUDINARY_BASE_URL = "https://res.cloudinary.com/dy082ykuf/image/upload/v1754930203/wega-kitchenware/products"

# Mapping of local image filenames to Cloudinary URLs
LOCAL_TO_CLOUDINARY_MAPPING = {
    # Featured Products (6)
    "dutch oven.jpg": f"{CLOUDINARY_BASE_URL}/dutch-oven.jpg",
    "coffee maker electric.jpg": f"{CLOUDINARY_BASE_URL}/coffee-maker-electric.jpg",
    "stock pot.jpg": f"{CLOUDINARY_BASE_URL}/stock-pot.jpg",
    "ceramic plates.jpg": f"{CLOUDINARY_BASE_URL}/ceramic-plates.jpg",
    "5 piece cooking set.jpg": f"{CLOUDINARY_BASE_URL}/5-piece-cooking-set.jpg",
    "electric kettle.jpg": f"{CLOUDINARY_BASE_URL}/electric-kettle.jpg",
    
    # New Products (7)
    "oval baking pan.jpg": f"{CLOUDINARY_BASE_URL}/oval-baking-pan.jpg",
    "food container set.jpg": f"{CLOUDINARY_BASE_URL}/food-container-set.jpg",
    "steak knife set.jpg": f"{CLOUDINARY_BASE_URL}/steak-knife-set.jpg",
    "toaster.jpg": f"{CLOUDINARY_BASE_URL}/toaster.jpg",
    "microwave.jpg": f"{CLOUDINARY_BASE_URL}/microwave.jpg",
    "black electric kettle.jpg": f"{CLOUDINARY_BASE_URL}/black-electric-kettle.jpg",
    "clothes iron.jpeg": f"{CLOUDINARY_BASE_URL}/clothes-iron.jpg",
    
    # Sale Products (8)
    "casserole.jpg": f"{CLOUDINARY_BASE_URL}/casserole.jpg",
    "plate set.jpg": f"{CLOUDINARY_BASE_URL}/plate-set.jpg",
    "plates and cups set.jpg": f"{CLOUDINARY_BASE_URL}/plates-and-cups-set.jpg",
    "plastic dishes.jpg": f"{CLOUDINARY_BASE_URL}/plastic-dishes.jpg",
    "cups.jpg": f"{CLOUDINARY_BASE_URL}/cups.jpg",
    "cup set.jpg": f"{CLOUDINARY_BASE_URL}/cup-set.jpg",
    "water glass.jpeg": f"{CLOUDINARY_BASE_URL}/water-glass.jpg",
    "wine glasses.jpg": f"{CLOUDINARY_BASE_URL}/wine-glasses.jpg",
    
    # Regular Products (35)
    "kitchen towels.jpeg": f"{CLOUDINARY_BASE_URL}/kitchen-towels.jpg",
    "ceramic mug.jpeg": f"{CLOUDINARY_BASE_URL}/ceramic-mug.jpg",
    "stainless steel knife.jpg": f"{CLOUDINARY_BASE_URL}/stainless-steel-knife.jpg",
    "bamboo spatulas.jpg": f"{CLOUDINARY_BASE_URL}/bamboo-spatulas.jpg",
    
    # Additional Products (31)
    "2 bowl set.jpg": f"{CLOUDINARY_BASE_URL}/2-bowl-set.jpg",
    "3 knife set.jpg": f"{CLOUDINARY_BASE_URL}/3-knife-set.jpg",
    "4 nesting bowl set.jpg": f"{CLOUDINARY_BASE_URL}/4-nesting-bowl-set.jpg",
    "5 piece cooking set 2.jpg": f"{CLOUDINARY_BASE_URL}/5-piece-cooking-set-2.jpg",
    "6 bowl set.jpg": f"{CLOUDINARY_BASE_URL}/6-bowl-set.jpg",
    "7 small plate set.jpg": f"{CLOUDINARY_BASE_URL}/7-small-plate-set.jpg",
    "aromatic scent dispenser.jpeg": f"{CLOUDINARY_BASE_URL}/aromatic-scent-dispenser.jpg",
    "iron kettle.jpg": f"{CLOUDINARY_BASE_URL}/iron-kettle.jpg",
    "plate cup and spoon set.jpg": f"{CLOUDINARY_BASE_URL}/plate-cup-and-spoon-set.jpg",
    "plate set 2.jpg": f"{CLOUDINARY_BASE_URL}/plate-set-2.jpg",
    "premium spoon and fork.jpg": f"{CLOUDINARY_BASE_URL}/premium-spoon-and-fork.jpg",
    "scissors.jpg": f"{CLOUDINARY_BASE_URL}/scissors.jpg",
    "small bamboo chair.jpeg": f"{CLOUDINARY_BASE_URL}/small-bamboo-chair.jpg",
    "spice jars.jpg": f"{CLOUDINARY_BASE_URL}/spice-jars.jpg",
    "spice jars 2.jpg": f"{CLOUDINARY_BASE_URL}/spice-jars-2.jpg",
    "spoons and forks.jpg": f"{CLOUDINARY_BASE_URL}/spoons-and-forks.jpg",
    "spoons kives forks.jpg": f"{CLOUDINARY_BASE_URL}/spoons-knives-forks.jpg",
    "stainless steel fork and knife.jpg": f"{CLOUDINARY_BASE_URL}/stainless-steel-fork-and-knife.jpg",
    "chopstick and fork and knife.jpg": f"{CLOUDINARY_BASE_URL}/chopstick-and-fork-and-knife.jpg",
    "chopsticks and plate and spoon.jpg": f"{CLOUDINARY_BASE_URL}/chopsticks-and-plate-and-spoon.jpg",
    "chopsticks and soup spoon.jpg": f"{CLOUDINARY_BASE_URL}/chopsticks-and-soup-spoon.jpg",
    "coffee maker set.jpg": f"{CLOUDINARY_BASE_URL}/coffee-maker-set.jpg",
    "electric kettle.jpeg": f"{CLOUDINARY_BASE_URL}/electric-kettle-alt.jpg",
    "tea pot.jpg": f"{CLOUDINARY_BASE_URL}/tea-pot.jpg",
    "table oven.jpg": f"{CLOUDINARY_BASE_URL}/table-oven.jpg",
    "wood spatulas.jpg": f"{CLOUDINARY_BASE_URL}/wood-spatulas.jpg",
    "wooden flower pot 5.jpg": f"{CLOUDINARY_BASE_URL}/wooden-flower-pot-5.jpg",
    "woven basket.jpeg": f"{CLOUDINARY_BASE_URL}/woven-basket.jpg",
    "ceramic black flower pot.jpg": f"{CLOUDINARY_BASE_URL}/ceramic-black-flower-pot.jpg",
    "black handle knive set.jpg": f"{CLOUDINARY_BASE_URL}/black-handle-knife-set.jpg",
    "butcher knife set.jpg": f"{CLOUDINARY_BASE_URL}/butcher-knife-set.jpg",
}

def get_cloudinary_url(local_filename):
    """Get Cloudinary URL for a local image filename"""
    return LOCAL_TO_CLOUDINARY_MAPPING.get(local_filename, f"{CLOUDINARY_BASE_URL}/default-product.jpg")

def get_product_images(product_name, local_images):
    """Convert local image filenames to Cloudinary URLs for a product"""
    cloudinary_images = []
    for local_image in local_images:
        cloudinary_url = get_cloudinary_url(local_image)
        cloudinary_images.append(cloudinary_url)
    return cloudinary_images

# List of all available Cloudinary URLs for random assignment
ALL_CLOUDINARY_URLS = list(LOCAL_TO_CLOUDINARY_MAPPING.values())

# Fallback URLs for products that don't have specific mappings
FALLBACK_URLS = [
    f"{CLOUDINARY_BASE_URL}/default-product-1.jpg",
    f"{CLOUDINARY_BASE_URL}/default-product-2.jpg",
    f"{CLOUDINARY_BASE_URL}/default-product-3.jpg",
]
