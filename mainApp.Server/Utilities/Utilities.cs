namespace mainApp.Server.Utilities
{
    public static class Utilities
    {
        public static int ParseDuration(string isoDuration)
        {
            // Check convention exists
            if (!isoDuration.StartsWith("PT"))
            {
                throw new ArgumentException("Invalid ISO 8601 duration format. Expected format: PT...");
            }

            int hours = 0;
            int minutes = 0;

            var duration = isoDuration.Substring(2);

            if (duration.Contains("H"))
            {
                var hourPart = duration.Substring(0, duration.IndexOf("H"));
                hours = int.Parse(hourPart);
                duration = duration.Substring(duration.IndexOf("H") + 1);
            }

            if (duration.Contains("M"))
            {
                var minutePart = duration.Substring(0, duration.IndexOf("M"));
                minutes = int.Parse(minutePart);
            }

            return (hours * 60) + minutes; // Returnăm durata totală în minute
        }

    }
}
