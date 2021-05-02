﻿using System;

namespace CybersecurityPortal.API.Exceptions
{
    public class NotFoundException : DomainException
    {
        public NotFoundException(string? message) : base(message)
        {
        }

        public NotFoundException(string? message, Exception? innerException) : base(message, innerException)
        {
        }
    }
}
