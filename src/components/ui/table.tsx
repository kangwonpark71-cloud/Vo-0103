import type { ThHTMLAttributes, TdHTMLAttributes, HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export function Table({ className, children }: HTMLAttributes<HTMLTableElement>) {
  return (
    <div className="w-full overflow-auto">
      <table className={cn('w-full caption-bottom text-sm', className)}>
        {children}
      </table>
    </div>
  );
}

export function TableHeader({ className, children }: HTMLAttributes<HTMLTableSectionElement>) {
  return <thead className={cn('[&_tr]:border-b', className)}>{children}</thead>;
}

export function TableBody({ className, children }: HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody className={cn('[&_tr:last-child]:border-0', className)}>{children}</tbody>;
}

export function TableRow({ className, children }: HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr className={cn('border-b transition-colors hover:bg-gray-50', className)}>
      {children}
    </tr>
  );
}

export function TableHead({ className, children, ...props }: ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th className={cn('h-10 px-4 text-left align-middle font-label', className)} {...props}>
      {children}
    </th>
  );
}

export function TableCell({ className, children, ...props }: TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td className={cn('px-4 py-3 align-middle text-sm', className)} {...props}>
      {children}
    </td>
  );
}
