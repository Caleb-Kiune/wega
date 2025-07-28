from datetime import datetime, timedelta
from werkzeug.security import generate_password_hash, check_password_hash
from . import db

class AdminUser(db.Model):
    __tablename__ = 'admin_users'
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False, index=True)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(20), default='admin')  # admin, super_admin
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    last_login = db.Column(db.DateTime)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Rate limiting and security fields
    failed_login_attempts = db.Column(db.Integer, default=0)
    locked_until = db.Column(db.DateTime)
    last_failed_attempt = db.Column(db.DateTime)

    def __repr__(self):
        return f'<AdminUser {self.username}>'

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

    def to_dict(self):
        """Convert to dictionary for JSON serialization"""
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'role': self.role,
            'is_active': self.is_active,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'last_login': self.last_login.isoformat() if self.last_login else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'failed_login_attempts': self.failed_login_attempts,
            'locked_until': self.locked_until.isoformat() if self.locked_until else None,
            'is_locked': self.is_locked()
        }

    def to_dict_public(self):
        """Convert to dictionary without sensitive information"""
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'role': self.role,
            'is_active': self.is_active,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'last_login': self.last_login.isoformat() if self.last_login else None
        } 