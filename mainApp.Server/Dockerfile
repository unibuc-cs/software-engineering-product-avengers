# Imaginea de bază pentru runtime .NET
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
USER $APP_UID
WORKDIR /app
EXPOSE 8080
EXPOSE 5190

# Imaginea de bază pentru SDK .NET
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS with-node
RUN apt-get update
RUN apt-get install curl
RUN curl -sL https://deb.nodesource.com/setup_22.x | bash
RUN apt-get -y install nodejs
WORKDIR /src

# Copierea fișierelor proiectului și restaurarea dependențelor
FROM with-node AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["mainApp.Server/mainApp.Server.csproj", "mainApp.Server/"]
COPY ["mainapp.client/mainapp.client.esproj", "mainapp.client/"]
RUN dotnet restore "./mainApp.Server/mainApp.Server.csproj"
COPY . .
WORKDIR "/src/mainApp.Server"
RUN dotnet build "./mainApp.Server.csproj" -c $BUILD_CONFIGURATION -o /app/build


# Publicarea aplicației
FROM build AS publish
RUN dotnet publish "./mainApp.Server.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Imaginea finală pentru runtime
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "mainApp.Server.dll"]
