import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

// Import services từ shell app
declare const window: any;

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss'
})
export class UserProfileComponent implements OnInit {
  user = {
    id: 1,
    name: 'Nguyễn Văn A',
    email: 'nguyenvana@example.com',
    role: 'Admin',
    avatar: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgdmlld0JveD0iMCAwIDE1MCAxNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxNTAiIGhlaWdodD0iMTUwIiBmaWxsPSIjRjNGNEY2Ii8+CjxjaXJjbGUgY3g9Ijc1IiBjeT0iNjAiIHI9IjI1IiBmaWxsPSIjOUNBM0FGIi8+CjxwYXRoIGQ9Ik0zMCAxMjBDMzAgMTA0IDUwIDkwIDc1IDkwUzEyMCAxMDQgMTIwIDEyMFYxNTBIMzBWMTIwWiIgZmlsbD0iIzlDQTNBRiIvPgo8L3N2Zz4K',
  };

  users = [
    { id: 1, name: 'Nguyễn Văn A', email: 'nguyenvana@example.com', role: 'Admin' },
    { id: 2, name: 'Trần Thị B', email: 'tranthib@example.com', role: 'User' },
    { id: 3, name: 'Lê Văn C', email: 'levanc@example.com', role: 'Manager' },
    { id: 4, name: 'Phạm Thị D', email: 'phamthid@example.com', role: 'User' }
  ];


  ngOnInit() {
    this.loadStateFromStorage();
  }

  selectUserForProducts(selectedUser: any) {
    if (window.emitEvent) {
      window.emitEvent('USER_SELECTED', selectedUser, 'USER_MFE');
    }
    this.user = { ...this.user, ...selectedUser };
    this.saveStateToStorage();
  }

  changeUserRole(event: Event) {
    const target = event.target as HTMLSelectElement;
    const newRole = target.value;
    const updatedUser = { ...this.user, role: newRole };
    this.user = updatedUser;
    
    if (window.emitEvent) {
      window.emitEvent('USER_ROLE_CHANGED', updatedUser, 'USER_MFE');
    }

    this.saveStateToStorage();
  }

  private saveStateToStorage() {
    const state = {
      user: this.user,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem('mfe-user-state', JSON.stringify(state));
  }

  private loadStateFromStorage() {
    const saved = localStorage.getItem('mfe-user-state');
    if (saved) {
      try {
        const state = JSON.parse(saved);
        const savedTime = new Date(state.timestamp);
        const now = new Date();
        const minutesDiff = (now.getTime() - savedTime.getTime()) / (1000 * 60);
        
        if (minutesDiff < 2) {
          this.user = { ...this.user, ...state.user };
          console.log('🔄 Restored user state:', this.user);
          
          if (state.user.id !== 1) {
            if (window.emitEvent) {
              window.emitEvent('USER_SELECTED', this.user, 'USER_MFE');
            }
          }
        } else {
          localStorage.removeItem('mfe-user-state');
        }
      } catch (error) {
        console.warn('Failed to load user state:', error);
      }
    }
  }
}
