using System.Threading.Tasks;
using CybersecurityPortal.API.Models;

namespace CybersecurityPortal.API.Services
{
    public interface IJwtGenerator
    {
        Task<string> CreateToken(User user);
    }
}