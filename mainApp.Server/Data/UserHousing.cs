using System.ComponentModel.DataAnnotations;

namespace mainApp.Server.Data
{
    public class UserHousing
    {
        [Key]
        public int Id { get; set; }
        public int HousingId { get; set; }
        public Housing Housing { get; set; }
        public string UserId { get; set; }
        public ApplicationUser User { get; set; }

        public DateTime CheckIn { get; set; }
        public DateTime CheckOut { get; set; }

    }
}
