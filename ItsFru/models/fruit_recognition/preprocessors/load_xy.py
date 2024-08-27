
def load_xy(txt_path):
    with open(txt_path, 'r') as f:
        txt = f.read()

    txt_list = txt.split(' ')[1:]

    total_xy=[]
    xy = []
    for idx, t in enumerate(txt_list):
        cord = int(float(t)*640)
        xy.append(cord)
        if idx%2!=0:
            total_xy.append(xy)
            xy=[]

    return total_xy
    
