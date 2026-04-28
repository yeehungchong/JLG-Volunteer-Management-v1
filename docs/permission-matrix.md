# Role-Based Permission Matrix

| Capability | System Administrator | Volunteer Leader | Reporting Officer | Duty/Shift Officer | Volunteer |
|---|---|---|---|---|---|
| Manage users and roles | ✅ | ❌ | ❌ | ❌ | ❌ |
| CRUD volunteers | ✅ | ✅ | Read | Read | Read own-only (optional) |
| Create shifts | ✅ | ✅ | ❌ | ❌ | ❌ |
| Edit shifts before start | ✅ | ✅ | ❌ | ❌ | ❌ |
| Add intended volunteers | ✅ | ✅ | Read | Read | ❌ |
| Select volunteers / assign shift role | ✅ | ❌ | ✅ | ❌ | ❌ |
| Mark email notification sent | ✅ | ✅ | ❌ | ❌ | ❌ |
| Complete pre/post checklist | ✅ | Read | Read | ✅ | Optional self-service |
| Check-in / check-out volunteers | ✅ | Read | Read | ✅ | Optional self-service |
| Approve/complete shift | ✅ | ❌ | ✅ | ❌ | ❌ |
| View audit logs | ✅ | ❌ | ❌ | ❌ | ❌ |
