import { Order } from '@/lib/orders';
import { format, isValid, parseISO } from 'date-fns';

interface OrderTimelineProps {
  order: Order;
  variant?: 'compact' | 'detailed';
}

const timelineSteps = [
  { id: 'confirmed', label: 'Order Confirmed', description: 'Your order has been received and confirmed.' },
  { id: 'processing', label: 'Processing', description: 'Our team is preparing your order for shipment.' },
  { id: 'shipped', label: 'Shipping', description: 'Your order is on its way to you.' },
  { id: 'delivered', label: 'Delivered', description: 'Your order has been delivered to your address.' }
];

const getStepStatus = (orderStatus: Order['status'], stepId: string) => {
  const statusOrder = ['pending', 'processing', 'shipped', 'delivered'];
  const currentIndex = statusOrder.indexOf(orderStatus);
  const stepIndex = timelineSteps.findIndex(step => step.id === stepId);
  
  if (orderStatus === 'cancelled') {
    return 'cancelled';
  }
  
  if (stepIndex <= currentIndex) {
    return 'completed';
  }
  
  return 'pending';
};

const getStepStyles = (status: 'completed' | 'pending' | 'cancelled') => {
  switch (status) {
    case 'completed':
      return {
        circle: 'bg-emerald-100 border-emerald-500',
        number: 'text-emerald-600',
        title: 'text-slate-800',
        description: 'text-slate-600',
        text: 'text-slate-600'
      };
    case 'pending':
      return {
        circle: 'bg-slate-100 border-slate-300',
        number: 'text-slate-400',
        title: 'text-slate-400',
        description: 'text-slate-400',
        text: 'text-slate-400'
      };
    case 'cancelled':
      return {
        circle: 'bg-red-100 border-red-500',
        number: 'text-red-600',
        title: 'text-red-600',
        description: 'text-red-500',
        text: 'text-red-500'
      };
  }
};

export default function OrderTimeline({ order, variant = 'detailed' }: OrderTimelineProps) {
  const safeFormat = (dateString: string | null | undefined, fmt: string) => {
    if (!dateString) return 'N/A';
    const date = typeof dateString === 'string' ? parseISO(dateString) : new Date(dateString);
    if (!isValid(date)) return 'N/A';
    return format(date, fmt);
  };

  if (variant === 'compact') {
    return (
      <div className="space-y-4">
        {timelineSteps.map((step, index) => {
          const stepStatus = getStepStatus(order.status, step.id);
          const styles = getStepStyles(stepStatus);
          
          return (
            <div key={step.id} className="flex items-start gap-3">
              <div className={`w-2 h-2 rounded-full mt-2 border-2 ${styles.circle}`}></div>
              <div className="flex-1">
                <p className={`font-medium ${styles.title}`}>{step.label}</p>
                <p className={`text-sm ${styles.text}`}>
                  {stepStatus === 'completed' && step.id === 'confirmed' 
                    ? safeFormat(order.created_at, 'MMM d, yyyy h:mm a')
                    : stepStatus === 'completed' 
                      ? 'Completed'
                      : 'Pending'
                  }
                </p>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {timelineSteps.map((step, index) => {
        const stepStatus = getStepStatus(order.status, step.id);
        const styles = getStepStyles(stepStatus);
        
        return (
          <div key={step.id} className="flex items-start gap-3">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-1 border-2 ${styles.circle}`}>
              <span className={`text-xs font-bold ${styles.number}`}>{index + 1}</span>
            </div>
            <div className="flex-1">
              <h4 className={`font-medium mb-1 ${styles.title}`}>{step.label}</h4>
              {stepStatus === 'completed' && step.id === 'confirmed' && (
                <p className={`text-xs mb-1 ${styles.text}`}>
                  {safeFormat(order.created_at, 'MMM d, h:mm a')}
                </p>
              )}
              <p className={`text-xs ${styles.description}`}>{step.description}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
} 