# `Shopping cart` (zadanie na zaliczenie)

Celem projektu jest stworzenie **PROSTEGO** modułu jakim jest koszyk zakupów w sklepie internetowym.
Główne założenie aplikacji to stworzenie `REST API` pozwalające na dodanie, wyświetlanie, zmodyfikowanie i usunięcie elementów z koszyka.

Baza produktów i użytkowników może być ustawiona na sztywno(bez dodatkowego API do ich zarządzania, a jedynie pobierana z naszej 'bazy').

Podczas dodawania elementów do koszyka powinniśmy operować na identyfikatorach produktów oraz użytkownika.

API powinno pozwolić obsługiwać wielu użytkowników i koszyków.


## Wymagania na zaliczenie

1. Podstawą zaliczenia jest wykonanie najprostszego REST API pozwalającego na zarządzanie koszykiem internetowym.

2. (*) Aplikacja powinna pozwolić na dodawanie produktów z poziomu REST API.

3. (*) Dodawanie produktów powinno być zabezpieczone hasłem (middleware z hasłem na sztywno)


Ma to być aplikacja serwerowa w postaci `REST API`. Interfejs graficzny **nie jest wymagany**! Tematyka sklepu jak i produktów jest dowolna (warzywniak, sklep ze sprzętem komputerowym, itp.)


## **Ważne!**

Przetrzymywanie danych jak i ich struktura zależna jest od programisty! Pełna dowolność w wykorzystaniu bibliotek oraz bazy danych. Liczę na pomysłowość i kreatywność!

**Zaliczenie odbędzie się na ostatnich zajęciach z NodeJS, czyli `25-26.05.2019`.**

## **POWODZENIA**! ;)

# Notatki

## Technologie
- NodeJS
- MongoDB (Atlas)
- Express
- Mongoose

## Struktura bazy danych
Baza mongodb przechowuje kolekcje:
- products
- users
- carts

## Poprawna obsługa kodów HTTP
REST API musi obsługiwać i zwracać poprawne kody HTTP, trzymając się specyfikacji:
https://developer.mozilla.org/en-US/docs/Web/HTTP/Status

## Obsługa błedów
REST API zwraca w przypadku błędów odpowiedni kod HTTP oraz komunikat w formacie JSON
```
{ message: err.message }
```

## Mongoose tutorial
https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/mongoose

## Koncept
1. Autentykacja ogranicza się do odpowiedniego nagłówka.
2. Anonimowy użytkownik otrzymuje losowy ID
3. 3 typy użykowników:
  - Administrator (ma pełny dostęp do wszystkich zasobów)
  - Zarejestrowany użytkownik
  - Anonimowy użytkownik
4. Różnica między administratorem a użytkownikiem jest taka, że użytkownik nie ma dostępu do edycji zasobu `products` (tylko metoda `GET`)
5. Koszyk zapisuje ID użytkownika który jest jego właścicielem, jeżeli użytkownik nie ma koszyka -> zostaje mu on stworzony.
6. Kazdy użytkonik ma tylko JEDEN koszyk
7. Jeżeli ten sam produkt zostanie dodany do koszyka -> zsumuj do istniejącej pozycji
8. (opcjonalne) koszyk starszy niż 1 dzień, zostaje usunięty
9. (opcjonalne) anonimowy użytkownik zostaje usunięty po 48h (pamiętaj o koszykach)