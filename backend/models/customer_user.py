from datetime import datetime, timedelta
from werkzeug.security import generate_password_hash, check_password_hash
from . import db

class CustomerUser(db.Model):
    __tablename__ = 'customer_users'
    
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    first_name = db.Column(db.String(50), nullable=False)
    last_name = db.Column(db.String(50), nullable=False)
    email_verified = db.Column(db.Boolean, default=False)
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    last_login = db.Column(db.DateTime)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Account deletion fields (GDPR compliance)
    deleted_at = db.Column(db.DateTime)
    deletion_reason = db.Column(db.String(255))
    data_export_requested = db.Column(db.Boolean, default=False)
    data_export_date = db.Column(db.DateTime)
    
    # Basic security fields
    failed_login_attempts = db.Column(db.Integer, default=0)
    locked_until = db.Column(db.DateTime)
    last_failed_attempt = db.Column(db.DateTime)

    def __repr__(self):
        return f'<CustomerUser {self.email}>'

    def set_password(self, password):
        """Hash and set password"""
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        """Check if provided password matches hash"""
        return check_password_hash(self.password_hash, password)

    def is_locked(self):
        """Check if account is currently locked"""
        if not self.locked_until:
            return False
        return datetime.utcnow() < self.locked_until

    def is_deleted(self):
        """Check if account has been deleted"""
        return self.deleted_at is not None

    def increment_failed_attempts(self):
        """Increment failed login attempts and lock if necessary"""
        self.failed_login_attempts += 1
        self.last_failed_attempt = datetime.utcnow()
        
        # Lock account after 5 failed attempts for 15 minutes
        if self.failed_login_attempts >= 5:
            self.locked_until = datetime.utcnow() + timedelta(minutes=15)
        
        db.session.commit()

    def reset_failed_attempts(self):
        """Reset failed login attempts on successful login"""
        self.failed_login_attempts = 0
        self.locked_until = None
        self.last_failed_attempt = None
        db.session.commit()

    def get_lockout_remaining(self):
        """Get remaining lockout time in seconds"""
        if not self.locked_until:
            return 0
        remaining = (self.locked_until - datetime.utcnow()).total_seconds()
        return max(0, int(remaining))

    def delete_account(self, reason="User requested deletion"):
        """Soft delete account with GDPR compliance"""
        self.is_active = False
        self.deleted_at = datetime.utcnow()
        self.deletion_reason = reason
        
        # Anonymize sensitive data
        self.first_name = f"Deleted_{self.id}"
        self.last_name = "User"
        self.email = f"deleted_{self.id}@deleted.user"
        self.last_login = None
        
        db.session.commit()

    def export_data(self):
        """Export user data for GDPR compliance"""
        self.data_export_requested = True
        self.data_export_date = datetime.utcnow()
        db.session.commit()
        
        return {
            'user_id': self.id,
            'email': self.email,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'last_login': self.last_login.isoformat() if self.last_login else None,
            'is_active': self.is_active,
            'email_verified': self.email_verified,
            'exported_at': self.data_export_date.isoformat() if self.data_export_date else None
        }

    def to_dict(self):
        """Convert to dictionary for JSON serialization"""
        return {
            'id': self.id,
            'email': self.email,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'email_verified': self.email_verified,
            'is_active': self.is_active,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'last_login': self.last_login.isoformat() if self.last_login else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'deleted_at': self.deleted_at.isoformat() if self.deleted_at else None
        }

    def to_dict_public(self):
        """Convert to dictionary without sensitive information"""
        return {
            'id': self.id,
            'email': self.email,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'email_verified': self.email_verified,
            'is_active': self.is_active,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'last_login': self.last_login.isoformat() if self.last_login else None
        }
