from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("app", "0014_remove_product_stock"),
    ]

    operations = [
        migrations.AddField(
            model_name="product",
            name="sku",
            field=models.CharField(blank=True, max_length=100, null=True, unique=True),
        ),
    ]
