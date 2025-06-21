import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { OrdersPage } from '../admin/orders/page';
import { OrderDetailsPage } from '../admin/orders/[id]/page';
import { ordersApi } from '../lib/api/orders';

// Mock the ordersApi
jest.mock('../lib/api/orders', () => ({
  ordersApi: {
    getAll: jest.fn(),
    getById: jest.fn(),
    updateStatus: jest.fn(),
    updatePaymentStatus: jest.fn(),
  },
}));

// Mock the router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    back: jest.fn(),
  }),
}));

describe('OrdersPage', () => {
  const mockOrders = {
    orders: [
      {
        id: 1,
        order_number: 'TEST-001',
        first_name: 'John',
        last_name: 'Doe',
        email: 'john@example.com',
        phone: '1234567890',
        total_amount: 1000,
        status: 'pending',
        payment_status: 'pending',
        created_at: '2024-03-20T10:00:00Z',
        items: [],
      },
    ],
    pages: 1,
  };

  beforeEach(() => {
    (ordersApi.getAll as jest.Mock).mockResolvedValue(mockOrders);
  });

  it('renders orders list', async () => {
    render(<OrdersPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Order Management')).toBeInTheDocument();
      expect(screen.getByText('TEST-001')).toBeInTheDocument();
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });
  });

  it('updates order status', async () => {
    (ordersApi.updateStatus as jest.Mock).mockResolvedValue({ ...mockOrders.orders[0], status: 'processing' });
    
    render(<OrdersPage />);
    
    await waitFor(() => {
      expect(screen.getByText('TEST-001')).toBeInTheDocument();
    });

    const statusSelect = screen.getByRole('combobox');
    fireEvent.change(statusSelect, { target: { value: 'processing' } });

    await waitFor(() => {
      expect(ordersApi.updateStatus).toHaveBeenCalledWith(1, 'processing');
    });
  });
});

describe('OrderDetailsPage', () => {
  const mockOrder = {
    id: 1,
    order_number: 'TEST-001',
    first_name: 'John',
    last_name: 'Doe',
    email: 'john@example.com',
    phone: '1234567890',
    address: '123 Test St',
    city: 'Test City',
    state: 'Test State',
    postal_code: '12345',
    total_amount: 1000,
    shipping_cost: 100,
    status: 'pending',
    payment_status: 'pending',
    created_at: '2024-03-20T10:00:00Z',
    items: [
      {
        id: 1,
        product: {
          id: 1,
          name: 'Test Product',
          image_url: 'http://example.com/image.jpg',
        },
        quantity: 1,
        price: 1000,
      },
    ],
  };

  beforeEach(() => {
    (ordersApi.getById as jest.Mock).mockResolvedValue(mockOrder);
  });

  it('renders order details', async () => {
    render(<OrderDetailsPage params={{ id: '1' }} />);
    
    await waitFor(() => {
      expect(screen.getByText('Order #TEST-001')).toBeInTheDocument();
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('john@example.com')).toBeInTheDocument();
      expect(screen.getByText('Test Product')).toBeInTheDocument();
    });
  });

  it('updates order status', async () => {
    (ordersApi.updateStatus as jest.Mock).mockResolvedValue({ ...mockOrder, status: 'processing' });
    
    render(<OrderDetailsPage params={{ id: '1' }} />);
    
    await waitFor(() => {
      expect(screen.getByText('Order #TEST-001')).toBeInTheDocument();
    });

    const statusSelect = screen.getByRole('combobox');
    fireEvent.change(statusSelect, { target: { value: 'processing' } });

    await waitFor(() => {
      expect(ordersApi.updateStatus).toHaveBeenCalledWith(1, 'processing');
    });
  });

  it('updates payment status', async () => {
    (ordersApi.updatePaymentStatus as jest.Mock).mockResolvedValue({ ...mockOrder, payment_status: 'paid' });
    
    render(<OrderDetailsPage params={{ id: '1' }} />);
    
    await waitFor(() => {
      expect(screen.getByText('Order #TEST-001')).toBeInTheDocument();
    });

    const paymentStatusSelect = screen.getAllByRole('combobox')[1];
    fireEvent.change(paymentStatusSelect, { target: { value: 'paid' } });

    await waitFor(() => {
      expect(ordersApi.updatePaymentStatus).toHaveBeenCalledWith(1, 'paid');
    });
  });
}); 