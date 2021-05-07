using CybersecurityPortal.API.Models;

namespace CybersecurityPortal.API.Services
{
    public interface IJwtGenerator
    {
        string CreateToken(User user);
    }
}