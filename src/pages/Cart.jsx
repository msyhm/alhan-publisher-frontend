import { Link } from "react-router-dom";
import PageMeta from "../components/PageMeta";
import useBooks from "../hooks/useBooks";
import { useCart } from "../context/CartContext";

function CartItemRow({ item, book, onUpdateQuantity, onRemove }) {
  if (!book) return null;

  const subtotal = book.price ? Number(book.price) * item.quantity : 0;

  return (
    <div className="flex items-center gap-4 bg-white rounded-2xl shadow-card border border-primary-light/10 p-4">
      <Link to={`/books/${book.id}`} className="shrink-0 w-16 sm:w-20 aspect-[2/3] rounded-lg overflow-hidden bg-primary-bg">
        {book.image ? (
          <img src={book.image} alt={book.title} className="w-full h-full object-cover" />
        ) : null}
      </Link>

      <div className="flex-1 min-w-0">
        <Link to={`/books/${book.id}`} className="font-bold text-primary hover:text-accent transition-colors line-clamp-1">
          {book.title}
        </Link>
        <p className="text-xs text-text-muted mt-0.5">{book.authorName}</p>

        <div className="flex items-center justify-between mt-3 flex-wrap gap-2">
          <div className="flex items-center gap-2 border-2 border-primary-light/20 rounded-xl">
            <button
              onClick={() => onUpdateQuantity(book.id, item.quantity - 1)}
              disabled={item.quantity <= 1}
              className="w-8 h-8 flex items-center justify-center text-primary disabled:opacity-30"
            >
              −
            </button>
            <span className="w-6 text-center text-sm font-bold">{item.quantity}</span>
            <button
              onClick={() => onUpdateQuantity(book.id, item.quantity + 1)}
              className="w-8 h-8 flex items-center justify-center text-primary"
            >
              +
            </button>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm font-bold text-accent">
              {book.price ? `${subtotal.toLocaleString("fa-IR")} تومان` : "تماس برای قیمت"}
            </span>
            <button
              onClick={() => onRemove(book.id)}
              title="حذف"
              className="text-red-400 hover:text-red-600 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Cart() {
  const { books } = useBooks();
  const { items, updateQuantity, removeItem, clearCart } = useCart();

  const cartRows = items
    .map((item) => ({ item, book: books.find((b) => b.id === item.bookId) }))
    .filter((row) => row.book);

  const total = cartRows.reduce((sum, { item, book }) => {
    return sum + (book.price ? Number(book.price) * item.quantity : 0);
  }, 0);

  const hasUnpricedItems = cartRows.some(({ book }) => !book.price);

  return (
    <>
      <PageMeta title="سبد خرید" description="سبد خرید شما در انتشارات الحان" />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-20 pt-28">
        <h1 className="text-3xl font-bold text-primary mb-8">سبد خرید</h1>

        {cartRows.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-6xl mb-4">🛒</p>
            <p className="text-text-muted mb-6">سبد خرید شما خالی است</p>
            <Link to="/books" className="btn-gold inline-block">مشاهده کتاب‌ها</Link>
          </div>
        ) : (
          <>
            <div className="space-y-3 mb-6">
              {cartRows.map(({ item, book }) => (
                <CartItemRow
                  key={book.id}
                  item={item}
                  book={book}
                  onUpdateQuantity={updateQuantity}
                  onRemove={removeItem}
                />
              ))}
            </div>

            <div className="bg-white rounded-2xl shadow-elegant p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-text-secondary">جمع کل ({cartRows.reduce((s, r) => s + r.item.quantity, 0)} کالا)</span>
                <span className="text-xl font-bold text-primary">
                  {total.toLocaleString("fa-IR")} تومان
                  {hasUnpricedItems && <span className="text-xs font-normal text-text-muted mr-1">(+ موارد بدون قیمت)</span>}
                </span>
              </div>

              <Link to="/checkout" className="btn-gold w-full flex items-center justify-center gap-2">
                ادامه به تسویه‌حساب
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>

              <button onClick={clearCart} className="w-full text-center text-xs text-text-muted hover:text-red-500 transition-colors mt-3">
                خالی‌کردن سبد خرید
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default Cart;