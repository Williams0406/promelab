from datetime import timedelta

from django.core.management.base import BaseCommand
from django.db import transaction
from django.utils import timezone

from app.models import Cart


class Command(BaseCommand):
    help = "Elimina carritos invitados sin actividad durante el periodo indicado."

    def add_arguments(self, parser):
        parser.add_argument(
            "--days",
            type=int,
            default=1,
            help="Dias de inactividad requeridos antes de eliminar carritos invitados.",
        )
        parser.add_argument(
            "--dry-run",
            action="store_true",
            help="Muestra cuantos carritos se eliminarian sin borrarlos.",
        )

    def handle(self, *args, **options):
        days = options["days"]
        cutoff = timezone.now() - timedelta(days=days)

        queryset = (
            Cart.objects.filter(
                user__isnull=True,
                created_at__lte=cutoff,
                updated_at__lte=cutoff,
            )
            .exclude(cartitem__updated_at__gt=cutoff)
            .distinct()
        )

        count = queryset.count()

        if options["dry_run"]:
            self.stdout.write(
                self.style.WARNING(
                    f"{count} carrito(s) invitado(s) serian eliminados."
                )
            )
            return

        with transaction.atomic():
            for cart in queryset.prefetch_related("cartitem_set"):
                cart.cartitem_set.all().delete()
                cart.delete()

        self.stdout.write(
            self.style.SUCCESS(f"{count} carrito(s) invitado(s) eliminados.")
        )
