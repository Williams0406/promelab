from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("app", "0015_product_sku"),
    ]

    operations = [
        migrations.AddField(
            model_name="user",
            name="google_sub",
            field=models.CharField(
                blank=True,
                db_index=True,
                max_length=255,
                null=True,
                unique=True,
            ),
        ),
    ]
