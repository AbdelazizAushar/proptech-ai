-- Listings: anyone with publishable key can read
create policy "Public can read listings"
on listings for select
using (true);

-- Listings: only secret key (n8n) can write
create policy "Secret key can manage listings"
on listings for all
using (auth.role() = 'service_role');

-- All other tables: secret key (n8n) only
create policy "Secret key can manage users"
on users for all
using (auth.role() = 'service_role');

create policy "Secret key can manage conversations"
on conversations for all
using (auth.role() = 'service_role');

create policy "Secret key can manage appointments"
on appointments for all
using (auth.role() = 'service_role');

create policy "Secret key can manage knowledge_base"
on knowledge_base for all
using (auth.role() = 'service_role');

create policy "Secret key can manage admins"
on admins for all
using (auth.role() = 'service_role');