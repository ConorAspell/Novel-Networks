from networkx.readwrite import json_graph
import networkx as nx
import json
from itertools import combinations 
import re
import matplotlib.pyplot as plt

def common_elements(a, b):
    a_set = set(a) 
    b_set = set(b) 
      
    if len(a_set.intersection(b_set)) > 0:
        comb = combinations(list(a_set.intersection(b_set)), 2)
        return list(comb)   
    else: 
        return False

def find_words():
    pass     
def find_sentences(fileobject, n):

    data = fileobject.read()
    data = data.split('.')
    holder = ""
    counter = 0
    for sentence in data:
        holder += sentence
        counter+=1
        if counter == n:
            holder = re.sub("[^a-z A-Z]+", " ", holder)
            edges_to_add= common_elements(holder.split(' '), names)
            if edges_to_add:
                for edge in edges_to_add:
                    add_edge_to_network(edge[0], edge[1])
            holder=""
            counter=0
    print("here")

def add_edge_to_network(person1, person2):
    if person1 == '' or person2 == '':
        return
    if person1 in nick_names:
        person1 = name_map[person1]
    if person2 in nick_names:
        person2 = name_map[person2]
    if person1 == person2:
        return
    if not G.has_edge(person1, person2):
        G.add_edge(person1, person2)
        G.edges[person1, person2]['weight'] =1
    else:
        G[person1][person2]['weight']+=1

def set_up(file_object):
    global G
    G= nx.Graph()
    global name_map
    name_map={}
    global names
    names = []
    global nick_names
    nick_names=[]
    headers = []
    i = 0
    for name in file_object:
        if(i==0):
            i+=1
        else:   
            name = name.strip();                              
            name = name.split(',')
            add_node_to_network(name[0], name[1], name[2])
    nodes = dict(G.nodes.data())

    for x in nodes.values():
        name_map[x['nickname']] = x['name']
        names.append(x['name'])
        if x['nickname'] != '':
            names.append(x['nickname'])
            nick_names.append(x['nickname'])

def add_node_to_network(person, nickname, group):
    size = len(G)
    G.add_node(person,name=person, nickname=nickname, group=group)
    print(G.nodes[person])

def add_centralities():
    pass
                
if __name__ == '__main__':
    file_object1 = open('test.txt', "r", encoding ='utf-8')
    file_object2 = open('character.csv', encoding ='utf-8')
    set_up(file_object2)

    findSentences(file_object1, 2)
    data = json_graph.node_link_data(G)
    H = json_graph.node_link_graph(data)
    s1 = json.dumps(data)
    print(s1)
