class Maillon:
    def __init__(self, valeur, suivante=None):
        self.valeur = valeur
        self.suivante = suivante


# ==============================================================================
# Question 1 : Conversion vers une liste Python (pour faciliter les tests)
# ==============================================================================
def vers_liste(lst):
    """Prend en paramètre une liste chaînée lst et renvoie un tableau dynamique Python."""
    # A completer :
    pass


# --- Jeux de tests pour vers_liste ---
# 1. Cas limite : la liste chaînée vide
assert vers_liste(None) == []
# 2. Liste à un seul élément
lst_un = Maillon(42)
assert vers_liste(lst_un) == [42]
# 3. Liste à plusieurs éléments (vérifie l'ordre de parcours)
lst_deux = Maillon(1, Maillon(2, Maillon(3, Maillon(4))))
assert vers_liste(lst_deux) == [1, 2, 3, 4]
# 4. Liste contenant 0 et des nombres négatifs
lst_trois = Maillon(10, Maillon(0, Maillon(-5, Maillon(0))))
assert vers_liste(lst_trois) == [10, 0, -5, 0]
# 5. Vérification que la liste chaînée d'origine n'est pas détruite/modifiée
assert vers_liste(lst_deux) == [1, 2, 3, 4]


# ==============================================================================
# Question 2 : Découpage d'une liste chaînée en deux sous-listes
# ==============================================================================
def coupe(lst):
    """Renvoie deux listes issues de lst ayant le même nombre d'éléments, à un près."""
    l1, l2 = None, None
    # A completer :
    while ................:
        .....
        .....
        .....
    return l1, l2


# --- Jeux de tests pour coupe ---
# 1. Liste vide
l1, l2 = coupe(None)
assert vers_liste(l1) == [] and vers_liste(l2) == []
# 2. Liste à 1 élément : 1 -> None
lst_1 = Maillon(1)
l1, l2 = coupe(lst_1)
assert vers_liste(l1) == [1] and vers_liste(l2) == []
# 3. Liste à 2 éléments : 1 -> 2 -> None
lst_2 = Maillon(1, Maillon(2))
l1, l2 = coupe(lst_2)
assert vers_liste(l1) == [1] and vers_liste(l2) == [2]
# 4. Liste de 5 éléments : 1 -> 2 -> 3 -> 4 -> 5 -> None
lst_5 = Maillon(1, Maillon(2, Maillon(3, Maillon(4, Maillon(5)))))
l1, l2 = coupe(lst_5)
assert vers_liste(l1) == [5, 3, 1] and vers_liste(l2) == [4, 2]
# 5. Liste de 4 éléments avec des zéros : 0 -> -5 -> 0 -> 42 -> None
lst_zeros = Maillon(0, Maillon(-5, Maillon(0, Maillon(42))))
l1, l2 = coupe(lst_zeros)
assert vers_liste(l1) == [0, 0] and vers_liste(l2) == [42, -5]


# ==============================================================================
# Question 3 : Fusion de deux listes chaînées triées
# ==============================================================================
def fusion(l1, l2):
    """Renvoie la fusion triée issue des deux listes chaînées triées l1 et l2."""
    # A completer :
    if l1 is None:
        return ....
    if l2 is None:
        return ....
    if .......................:
        return ..........................
    else:
        return .............


# --- Jeux de tests pour fusion ---
# 1. Deux listes vides
assert vers_liste(fusion(None, None)) == []
# 2. Une des deux listes est vide (teste les deux cas de base)
l_ex = Maillon(1, Maillon(3, Maillon(5)))
assert vers_liste(fusion(None, l_ex)) == [1, 3, 5]
assert vers_liste(fusion(l_ex, None)) == [1, 3, 5]
# 3. Fusion classique alternée de deux listes triées
l1 = Maillon(1, Maillon(4, Maillon(7)))
l2 = Maillon(2, Maillon(5, Maillon(8)))
assert vers_liste(fusion(l1, l2)) == [1, 2, 4, 5, 7, 8]
# 4. Listes de longueurs différentes et valeurs négatives / nulles
l3 = Maillon(-10, Maillon(0))
l4 = Maillon(-5, Maillon(0, Maillon(3, Maillon(12))))
assert vers_liste(fusion(l3, l4)) == [-10, -5, 0, 0, 3, 12]
# 5. Tous les éléments d'une liste sont plus petits que ceux de l'autre
l5 = Maillon(1, Maillon(2))
l6 = Maillon(10, Maillon(20, Maillon(30)))
assert vers_liste(fusion(l5, l6)) == [1, 2, 10, 20, 30]
assert vers_liste(fusion(l6, l5)) == [1, 2, 10, 20, 30]


# ==============================================================================
# Question 4 : Tri fusion d'une liste chaînée
# ==============================================================================
def tri_fusion(lst):
    """Renvoie la liste chaînée lst triée par la méthode du tri fusion."""
    # A completer :
    if lst is None or lst.suivante is None:
        return ....
    else:
        l1, l2 = .........
        return fusion(............., ............)


# --- Jeux de tests pour tri_fusion ---
# 1. Cas de base : liste vide
assert vers_liste(tri_fusion(None)) == []
# 2. Cas de base : liste à 1 élément
assert vers_liste(tri_fusion(Maillon(42))) == [42]
# 3. Liste déjà triée
lst_triee = Maillon(1, Maillon(2, Maillon(3, Maillon(4))))
assert vers_liste(tri_fusion(lst_triee)) == [1, 2, 3, 4]
# 4. Liste triée à l'envers (pire cas)
lst_inverse = Maillon(5, Maillon(4, Maillon(3, Maillon(2, Maillon(1)))))
assert vers_liste(tri_fusion(lst_inverse)) == [1, 2, 3, 4, 5]
# 5. Liste quelconque avec doublons, zéro et nombres négatifs
lst_melange = Maillon(12, Maillon(-3, Maillon(0, Maillon(7, Maillon(-3, Maillon(42, Maillon(0)))))))
assert vers_liste(tri_fusion(lst_melange)) == [-3, -3, 0, 0, 7, 12, 42]

print("Tous les tests sont validés !")