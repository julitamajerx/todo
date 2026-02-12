# Todo (Fullstack MEAN Stack & CI/CD)
Głównym celem projektu było stworzenie pełnoprawnej aplikacji typu Fullstack, łączącej ekosystem Angular z backendem w Express.js. Skupiłam się na architekturze typu Client-Server, zapewniając pełną komunikację z bazą danych MongoDB oraz wdrażając nowoczesne standardy automatyzacji procesów (CI/CD) i testowania.

### Kluczowe elementy projektu

Architektura Fullstack & Backend:

  - Node.js & Express: Stworzyłam REST API obsługujące pełen cykl CRUD. Serwer zarządza komunikacją z bazą danych, walidacją zapytań oraz przesyłaniem danych do frontendu w formacie JSON.

  - Baza danych MongoDB: Wykorzystałam nierelacyjną bazę danych do elastycznego przechowywania zadań i powiązanych z nimi list oraz tagów.

- Automatyzacja i Jakość (CI/CD):

  - GitHub Actions: Skonfigurowałam pipeline, który przy każdym commicie automatycznie dba o jakość projektu:

  - Linter & Formatter: Automatyczne uruchamianie ESLint i Prettier dla zachowania czystości kodu.

  - Auto-deploy: Po pomyślnym przejściu testów, aplikacja jest automatycznie publikowana na GitHub Pages.

  - Testy E2E (Playwright): Zaprojektowałam scenariusze testowe typu Happy Path, symulujące pełną ścieżkę użytkownika – od dodania zadania, przez jego edycję, aż po usunięcie. Gwarantuje to stabilność kluczowych funkcji przed każdym wdrożeniem.

 Frontend & Angular:

  - Ścisłe typowanie: Wykorzystanie TypeScript oraz generycznych interfejsów (np. ActionResponse<T>), co zapewnia spójność danych między backendem a frontendem.

  - Clean Code: Centralizacja endpointów w formie stałych, co eliminuje hardcoding i ułatwia skalowanie struktury URL.

  - Globalna obsługa HTTP: System interceptorów do scentralizowanej obsługi błędów oraz automatycznego zarządzania loaderem.

  - Nowoczesna Reaktywność (Signals): Logika oparta na sygnałach, przy zachowaniu RxJS do zapytań HTTP. Pozwala to na uniknięcie ręcznego zarządzania subskrypcjami i zwiększenie wydajności renderowania.

  - UX & Performance: Implementacja mechanizmu timeout dla spinnera, co zapobiega efektowi "migania" przy szybkich odpowiedziach z API.

  - Standardy Angular 17+: Wykorzystanie input() dla sprawnego przepływu danych oraz effect() do automatycznej synchronizacji stanu lokalnego z globalnym TaskService.

  - Adaptive Layout: Zarządzanie widokiem za pomocą CDK Layout. Aplikacja wykrywa urządzenia mobilne, zmieniając układ z dwukolumnowego Gridu na tryb pełnoekranowy (Mobile-first).

  - Bezpieczeństwo pamięci: W przypadkach użycia RxJS poza HTTP (np. obserwowanie szerokości ekranu), stosuję takeUntilDestroyed(), co jest najlepszą praktyką zapobiegania wyciekom pamięci.

  - Zaawansowany Edytor: Integracja edytora Rich Text (Quill) z Reactive Forms, co pozwala na zaawansowane formatowanie opisów zadań.

  - Modularność (CDK Dialog): Wykorzystanie @angular/cdk/dialog do stworzenia generycznych okien dialogowych zgodnie z zasadą DRY.

  - Optymalizacja widoku (Computed): Zastosowanie funkcji computed do zarządzania burtami (sidebar). Aplikacja wydajnie renderuje podgląd ostatnich elementów, zachowując przejrzystość przy dużej ilości danych.

  - Filtrowanie "on the fly": Mechanizmy sortByTags i sortByList wchodzą w bezpośrednią interakcję z globalnym stanem aplikacji, umożliwiając natychmiastowe filtrowanie zadań i szybki powrót do widoku ogólnego (reset).

  - Integracja zewnętrznych bibliotek: Zaimplementowałam obsługę emoji za pomocą ngx-emoji-mart. Stworzyłam spójny system personalizacji zadań, łącząc wybór ikon z natywnymi formularzami Angulara.

  - Synchronizacja stanu (Two-way Data Binding & Signals): Wykorzystałam sygnały do natychmiastowego odświeżania list wewnątrz komponentów zarządzania. Dzięki temu każda operacja utworzenia lub usunięcia tagu/listy jest od razu widoczna w całym interfejsie bez potrzeby przeładowania strony.

  - Logika selekcji wielokrotnej: W komponencie AddTags wdrożyłam mechanizm lokalnego buforowania zaznaczonych elementów. Pozwala to użytkownikowi na swobodną zmianę wyboru przed finalnym zatwierdzeniem zmian w serwisie (setSelectedTags), co optymalizuje proces aktualizacji danych.

  - Wdrożyłam mechanizm withCredentials: true na poziomie interceptora, co umożliwia bezpieczną obsługę sesji opartą o ciasteczka (HttpOnly cookies) w komunikacji z backendem Express.js.

  - Stworzyłam UserService zarządzający stanem zalogowanego użytkownika za pomocą Signals (asReadonly). System wspiera automatyczną rehydratację stanu z localStorage oraz bezpieczne przekierowania przy użyciu Auth Guards.

  - Zaimplementowałam funkcjonalność przesyłania awatarów przy rejestracji. Wykorzystałam obiekt FormData do asynchronicznego przesyłania plików graficznych wraz z metadanymi użytkownika do API.

  - Wykorzystanie ReactiveFormsModule do budowy formularzy logowania i rejestracji. Zastosowałam wbudowane walidatory (m.in. Validators.email, Validators.minLength) oraz mechanizm nonNullable, co zwiększa bezpieczeństwo typów wewnątrz komponentów.

  - Integracja biblioteki ngx-toastr wewnątrz serwisu użytkownika, co zapewnia spójny system powiadomień o sukcesach (np. poprawne logowanie) i błędach API w całej aplikacji. 

  - Konfiguracja routingu z obsługą tras chronionych (canActivate) oraz mechanizmu withHashLocation(), co ułatwia hosting aplikacji na platformach takich jak GitHub Pages.


Testy:

- Testy API (Integracyjne): * Weryfikacja pełnego cyklu życia danych (GET/POST) dla zadań, tagów i list.

  - Automatyzacja procesu autentykacji (loginApi) przy użyciu zmiennych środowiskowych, co pozwala na bezpieczne testy w środowiskach CI/CD.

  - Walidacja poprawności struktur JSON oraz kodów statusów HTTP (200 OK).

- Testy E2E (End-to-End):

  - Scenariusze Happy Path: Automatyzacja pełnej ścieżki użytkownika – od logowania, przez tworzenie złożonych zadań (z wyborem daty, tagów i formatowaniem opisu), aż po mechanizmy usuwania i przywracania danych z kosza.

  - Obsługa komponentów dynamicznych: Testy obejmują interakcje z elementami takimi jak edytor Quill, modale Angular CDK oraz wybór emoji z ngx-emoji-mart.

Backend:

  - Zaawansowana Autentykacja (JWT & Cookies): Wdrożyłam bezpieczny system logowania oparty na JSON Web Tokens przesyłanych w ciasteczkach HttpOnly. Dzięki temu aplikacja jest odporna na ataki XSS, a sesja użytkownika jest zarządzana po stronie serwera.

  - Integracja z Cloudinary & Multer: Zaimplementowałam zaawansowany moduł przesyłania plików. Zdjęcia profilowe są procesowane "w locie" (kadrowanie do twarzy, optymalizacja jakości) i przechowywane w chmurze Cloudinary, co odciąża serwer aplikacji.

  - Automatyzacja zadań (Cron Jobs): Wdrożyłam system node-cron, który każdej nocy automatycznie oczyszcza bazę danych z zadań starszych niż 30 dni. Pokazuje to dbałość o higienę danych i wydajność bazy MongoDB.

  - Scentralizowana obsługa błędów: Stworzyłam dedykowany errorMiddleware oraz autorską klasę AppError. System rozpoznaje specyficzne błędy bazy (np. CastError czy duplikaty), zwracając użytkownikowi czytelne komunikaty zamiast surowych błędów serwera.

  - Relacyjne modelowanie w MongoDB (Mongoose): Wykorzystałam mechanizm populate do łączenia zadań z listami i tagami. Architektura bazy uwzględnia pełną izolację danych – każdy użytkownik ma dostęp wyłącznie do swoich zasobów dzięki rygorystycznemu sprawdzaniu userId na poziomie kontrolerów.

  - Clean Code & Middleware: Wykorzystanie express-async-handler do czystej obsługi asynchroniczności oraz autorskich middleware’ów (np. authHandler) do ochrony tras przed nieautoryzowanym dostępem.

  - Depoly backendu na Renderer.

### Co wynioslam z projektu?

Projekt Todo Fullstack stanowi zwieńczenie mojego stażu i jest praktycznym sprawdzianem zdobytej wiedzy. Praca nad nim pozwoliła mi wyjść poza ramy samego kodowania komponentów i spojrzeć na aplikację jako na kompletny, bezpieczny produkt gotowy do wdrożenia. Projekt ten udowodnił mi, że najbardziej satysfakcjonuje mnie budowanie rozwiązań, które są nie tylko funkcjonalne, ale przede wszystkim stabilne, bezpieczne i napisane zgodnie z najlepszymi praktykami rynkowymi :)
