# %load get_category_id.py

def get_category_id(fruit_type_list):
    """
    파일 경로(basename)을 받으면 카테고리 id를 반환하는 함수
    PARAMETER
        fruit_type : 과일 품목
    """
    # 귤은 품종 구분 
    
    if fruit_type_list[0] == 'mandarine':
        fruit_type = fruit_type_list[1]
    else:
        fruit_type = fruit_type_list[0]

    cat_1 = {'apple':0, 'hallabong':1, 'onjumilgam':2, 'pear':3,'persimmon':4}
    # cat_2 = ['fuji','yanggwang','chuhwang','singo','hallabong','onjumilgam','bansi','booyu','daebong']

    if fruit_type in cat_1:
        return cat_1[fruit_type]
    else:
        raise KeyError(f"key error:{fruit_type}")
