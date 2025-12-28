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
    avatar: 'https://via.placeholder.com/150',
    joinDate: '2023-01-15',
    lastLogin: '2024-12-24 10:30:00'
  };

  users = [
    { id: 1, name: 'Nguyễn Văn A', email: 'nguyenvana@example.com', role: 'Admin' },
    { id: 2, name: 'Trần Thị B', email: 'tranthib@example.com', role: 'User' },
    { id: 3, name: 'Lê Văn C', email: 'levanc@example.com', role: 'Manager' },
    { id: 4, name: 'Phạm Thị D', email: 'phamthid@example.com', role: 'User' }
  ];

  activities = [
    { action: 'Đăng nhập hệ thống', time: '10:30:00', date: '2024-12-24' },
    { action: 'Cập nhật thông tin cá nhân', time: '09:15:00', date: '2024-12-23' },
    { action: 'Thay đổi mật khẩu', time: '14:20:00', date: '2024-12-22' },
    { action: 'Xem báo cáo', time: '16:45:00', date: '2024-12-21' }
  ];

  ngOnInit() {
    // Load saved state from localStorage
    this.loadStateFromStorage();
  }

  // Gửi thông tin user được chọn đến Product MFE
  selectUserForProducts(selectedUser: any) {
    // Emit event qua window object (global communication)
    if (window.emitEvent) {
      window.emitEvent('USER_SELECTED', selectedUser, 'USER_MFE');
    }
    
    // Highlight selected user and save state
    this.user = { ...this.user, ...selectedUser };
    this.saveStateToStorage();
  }

  // Gửi event khi user thay đổi role
  changeUserRole(event: Event) {
    const target = event.target as HTMLSelectElement;
    const newRole = target.value;
    const updatedUser = { ...this.user, role: newRole };
    this.user = updatedUser;
    
    if (window.emitEvent) {
      window.emitEvent('USER_ROLE_CHANGED', updatedUser, 'USER_MFE');
    }
    
    // Save state to persist across navigation
    this.saveStateToStorage();
  }

  // Save state to localStorage
  private saveStateToStorage() {
    const state = {
      user: this.user,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem('mfe-user-state', JSON.stringify(state));
  }

  // Load state from localStorage
  private loadStateFromStorage() {
    const saved = localStorage.getItem('mfe-user-state');
    if (saved) {
      try {
        const state = JSON.parse(saved);
        // Check if state is not too old (optional)
        const savedTime = new Date(state.timestamp);
        const now = new Date();
        const hoursDiff = (now.getTime() - savedTime.getTime()) / (1000 * 60 * 60);
        
        if (hoursDiff < 24) { // Keep state for 24 hours
          this.user = { ...this.user, ...state.user };
          console.log('🔄 Restored user state:', this.user);
        }
      } catch (error) {
        console.warn('Failed to load user state:', error);
      }
    }
  }
}
