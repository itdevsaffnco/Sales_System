@component('components.layouts.dashboard', ['title' => 'Platform Settings'])
    <div class="space-y-6">
        <div class="rounded-lg border border-slate-200 bg-white p-6">
            <h3 class="text-base font-semibold">Add Platform</h3>
            <form method="POST" action="{{ route('settings.channels.add') }}" class="mt-4 space-y-4" id="add-platform-form">
                @csrf
                <div>
                    <label class="block text-sm font-medium text-slate-700">Platform Name</label>
                    <input type="text" name="platform_name" class="mt-1 w-full rounded-md border border-slate-200 bg-white px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-100" required />
                </div>
                <div>
                    <label class="block text-sm font-medium text-slate-700">Platform Type</label>
                    <select name="platform_type" class="mt-1 w-full rounded-md border border-slate-200 bg-white px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-100" required>
                        <option value="online">Online</option>
                        <option value="offline">Offline</option>
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-medium text-slate-700">GMV Formula (optional)</label>
                    <div class="relative">
                        <input
                            type="text"
                            name="gmv_formula"
                            id="gmv_formula_input"
                            class="mt-1 w-full rounded-md border border-slate-200 bg-white px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-100"
                            placeholder="Example: RSP * qty"
                            autocomplete="off"
                        />
                        <div id="gmv_formula_suggestions" class="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg border border-slate-200 hidden max-h-48 overflow-y-auto"></div>
                    </div>
                    <p id="gmv_formula_error" class="mt-1 text-xs text-rose-600 hidden"></p>
                    <p class="mt-1 text-xs text-slate-500">
                        Available fields: RSP, qty, margin, brand_disc, brand_voucher, member.
                    </p>
                </div>
                <div>
                    <label class="block text-sm font-medium text-slate-700">GMV After Support Formula (optional)</label>
                    <div class="relative">
                        <input
                            type="text"
                            name="gmv_after_support_formula"
                            id="gmv_after_support_formula_input"
                            class="mt-1 w-full rounded-md border border-slate-200 bg-white px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-100"
                            placeholder="Example: GMV - (brand_disc + brand_voucher + margin)"
                            autocomplete="off"
                        />
                        <div id="gmv_after_support_formula_suggestions" class="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg border border-slate-200 hidden max-h-48 overflow-y-auto"></div>
                    </div>
                    <p id="gmv_after_support_formula_error" class="mt-1 text-xs text-rose-600 hidden"></p>
                    <p class="mt-1 text-xs text-slate-500">
                        Available fields: RSP, qty, margin, brand_disc, brand_voucher, member, GMV.
                        <br>
                        Note: GMV is automatically calculated as RSP * qty.
                    </p>
                </div>
                <div class="mt-4 rounded-md bg-slate-50 p-6 border border-slate-200">
                    <div class="text-base font-semibold text-slate-900">Formula Simulation</div>
                    <p class="mt-1 text-sm text-slate-500 mb-4">Enter values to simulate GMV calculation.</p>
                    
                    <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <!-- Row 1 -->
                        <div>
                            <label class="block text-sm font-medium leading-6 text-slate-900">RSP</label>
                            <div class="mt-1">
                                <input type="text" inputmode="numeric" id="sim_rsp" class="block w-full rounded-md border-0 py-2 px-3 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" placeholder="10.000">
                            </div>
                        </div>
                        <div>
                            <label class="block text-sm font-medium leading-6 text-slate-900">Qty</label>
                            <div class="mt-1">
                                <input type="number" min="0" step="1" id="sim_qty" class="block w-full rounded-md border-0 py-2 px-3 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
                            </div>
                        </div>
                        <div>
                            <label class="block text-sm font-medium leading-6 text-slate-900">Margin</label>
                            <div class="mt-1">
                                <input type="number" min="0" step="1" id="sim_margin" class="block w-full rounded-md border-0 py-2 px-3 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
                            </div>
                        </div>

                        <!-- Row 2 -->
                        <div>
                            <label class="block text-sm font-medium leading-6 text-slate-900">Brand Discount</label>
                            <div class="mt-1">
                                <input type="number" min="0" step="1" id="sim_brand_disc" class="block w-full rounded-md border-0 py-2 px-3 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
                            </div>
                        </div>
                        <div>
                            <label class="block text-sm font-medium leading-6 text-slate-900">Brand Voucher</label>
                            <div class="mt-1">
                                <input type="number" min="0" step="1" id="sim_brand_voucher" class="block w-full rounded-md border-0 py-2 px-3 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
                            </div>
                        </div>
                        <div>
                            <label class="block text-sm font-medium leading-6 text-slate-900">Member</label>
                            <div class="mt-1">
                                <input type="number" min="0" step="1" id="sim_member" class="block w-full rounded-md border-0 py-2 px-3 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
                            </div>
                        </div>
                    </div>

                    <div class="mt-6 flex flex-col gap-4 sm:flex-row sm:items-start">
                        <button type="button" onclick="simulatePlatformFormula()" class="w-full rounded-md bg-indigo-600 px-8 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:w-auto">Check GMV After Support</button>
                        
                        <div class="flex-1 space-y-3 relative">
                            <input type="text" id="sim_formula_input" class="block w-full rounded-md border-0 py-2.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" placeholder="Input Formula (RSP * qty) - ((RSP * qty) * margin)" autocomplete="off">
                            <div id="sim_formula_suggestions" class="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg border border-slate-200 hidden max-h-48 overflow-y-auto"></div>
                            <p id="sim_formula_error" class="text-xs text-rose-600 hidden"></p>
                            <input type="text" readonly id="sim_result" class="block w-full rounded-md border-0 py-2.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-slate-300 bg-slate-50 sm:text-sm sm:leading-6" placeholder="Result">
                        </div>
                    </div>
                </div>
                <div class="pt-2">
                    <button class="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700" type="submit">Save</button>
                </div>
            </form>
        </div>

        <div class="rounded-lg border border-slate-200 bg-white p-6">
            <div class="flex items-center justify-between gap-3">
                <h3 class="text-base font-semibold">Existing Platforms</h3>
                <div class="flex items-center gap-2">
                    <form method="GET" action="{{ route('settings.channels') }}" class="flex items-center gap-2">
                        <input name="q" value="{{ $q ?? request('q') }}" placeholder="Search name or type"
                               class="w-56 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100" />
                        <button class="rounded-md bg-slate-900 px-3 py-2 text-xs font-semibold text-white hover:bg-slate-800" type="submit">Search</button>
                    </form>
                    <a href="{{ route('settings.channels.download', array_filter(['q' => request('q')])) }}"
                       class="rounded-md bg-indigo-600 px-3 py-2 text-xs font-semibold text-white hover:bg-indigo-700">Download CSV</a>
                </div>
            </div>
            <div class="mt-4 space-y-2">
                @php
                    $platforms = $platforms ?? [];
                @endphp
                @forelse($platforms as $p)
                    <div class="flex items-center justify-between rounded-md border border-slate-200 px-4 py-2">
                        <div class="text-sm">
                            <div class="font-medium">{{ $p['name'] ?? '' }}</div>
                            <div class="text-xs text-slate-500 capitalize">{{ $p['type'] ?? '' }}</div>
                            @if(!empty($p['gmv_formula']) || !empty($p['gmv_after_support_formula']))
                                <div class="mt-1 text-[11px] text-slate-500">
                                    @if(!empty($p['gmv_formula']))
                                        <div>GMV: {{ $p['gmv_formula'] }}</div>
                                    @endif
                                    @if(!empty($p['gmv_after_support_formula']))
                                        <div>GMV After Support: {{ $p['gmv_after_support_formula'] }}</div>
                                    @endif
                                </div>
                            @endif
                        </div>
                        <div class="flex items-center gap-2">
                            <button
                                type="button"
                                class="rounded-md bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-200"
                                data-name="{{ $p['name'] ?? '' }}"
                                data-type="{{ $p['type'] ?? '' }}"
                                data-gmv="{{ $p['gmv_formula'] ?? '' }}"
                                data-gmv-after="{{ $p['gmv_after_support_formula'] ?? '' }}"
                                onclick="editPlatformFromList(this)"
                            >
                                Edit
                            </button>
                            <form method="POST" action="{{ route('settings.channels.delete') }}" onsubmit="return confirmDeletePlatform(this)">
                                @csrf
                                <input type="hidden" name="platform_name" value="{{ $p['name'] ?? '' }}" />
                                <button class="rounded-md bg-rose-600 px-3 py-1 text-xs font-semibold text-white hover:bg-rose-700" type="submit">Delete</button>
                            </form>
                        </div>
                    </div>
                @empty
                    <div class="text-sm text-slate-600">No platforms yet.</div>
                @endforelse
            </div>
        </div>
    </div>
    <script>
        function confirmDeletePlatform(form) {
            var input = form.querySelector('input[name="platform_name"]');
            var name = input ? input.value : '';
            return confirm('Delete platform ' + name + '?');
        }
        function editPlatformFromList(button) {
            var form = document.getElementById('add-platform-form');
            if (!form || !button) {
                return;
            }
            var name = button.getAttribute('data-name') || '';
            var type = button.getAttribute('data-type') || '';
            var gmv = button.getAttribute('data-gmv') || '';
            var gmvAfter = button.getAttribute('data-gmv-after') || '';
            var nameInput = form.querySelector('input[name="platform_name"]');
            var typeSelect = form.querySelector('select[name="platform_type"]');
            var gmvInput = form.querySelector('input[name="gmv_formula"]');
            var gmvAfterInput = form.querySelector('input[name="gmv_after_support_formula"]');
            if (nameInput) {
                nameInput.value = name;
            }
            if (typeSelect) {
                typeSelect.value = type;
            }
            if (gmvInput) {
                gmvInput.value = gmv;
            }
            if (gmvAfterInput) {
                gmvAfterInput.value = gmvAfter;
            }
            if (typeof form.scrollIntoView === 'function') {
                form.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
        document.addEventListener('DOMContentLoaded', function () {
            var rspInput = document.getElementById('sim_rsp');
            if (!rspInput) {
                return;
            }
            rspInput.addEventListener('input', function () {
                var raw = rspInput.value.replace(/[^0-9]/g, '');
                if (raw === '') {
                    rspInput.value = '';
                    return;
                }
                var number = parseInt(raw, 10);
                if (isNaN(number)) {
                    rspInput.value = '';
                    return;
                }
                var formatted = new Intl.NumberFormat('id-ID').format(number);
                rspInput.value = formatted;
                rspInput.setSelectionRange(rspInput.value.length, rspInput.value.length);
            });

            // Validation bindings
            var gmvInput = document.getElementById('gmv_formula_input');
            if (gmvInput) {
                gmvInput.addEventListener('input', function() {
                    validateInput('gmv_formula_input', 'gmv_formula_error', ['rsp', 'qty', 'margin', 'brand_disc', 'brand_voucher', 'member']);
                    showSuggestions(this, 'gmv_formula_suggestions', ['RSP', 'qty', 'margin', 'brand_disc', 'brand_voucher', 'member']);
                });
                // Close suggestions on blur (delayed to allow click)
                gmvInput.addEventListener('blur', function() {
                    setTimeout(() => document.getElementById('gmv_formula_suggestions').classList.add('hidden'), 200);
                });
            }

            var gmvAfterInput = document.getElementById('gmv_after_support_formula_input');
            if (gmvAfterInput) {
                gmvAfterInput.addEventListener('input', function() {
                    validateInput('gmv_after_support_formula_input', 'gmv_after_support_formula_error', ['rsp', 'qty', 'margin', 'brand_disc', 'brand_voucher', 'member', 'gmv']);
                    showSuggestions(this, 'gmv_after_support_formula_suggestions', ['RSP', 'qty', 'margin', 'brand_disc', 'brand_voucher', 'member', 'GMV']);
                });
                gmvAfterInput.addEventListener('blur', function() {
                    setTimeout(() => document.getElementById('gmv_after_support_formula_suggestions').classList.add('hidden'), 200);
                });
            }
            
            var simInput = document.getElementById('sim_formula_input');
            if (simInput) {
                simInput.addEventListener('input', function() {
                    validateInput('sim_formula_input', 'sim_formula_error', ['rsp', 'qty', 'margin', 'brand_disc', 'brand_voucher', 'member', 'gmv']);
                    showSuggestions(this, 'sim_formula_suggestions', ['RSP', 'qty', 'margin', 'brand_disc', 'brand_voucher', 'member', 'GMV']);
                });
                simInput.addEventListener('blur', function() {
                    setTimeout(() => document.getElementById('sim_formula_suggestions').classList.add('hidden'), 200);
                });
            }
        });

        function showSuggestions(input, suggestionsId, allowedVars) {
            const val = input.value;
            const cursorPos = input.selectionStart;
            
            // Find the word being typed at cursor position
            // We look backwards from cursor until we hit a separator or start of string
            const textBeforeCursor = val.substring(0, cursorPos);
            const match = textBeforeCursor.match(/([a-zA-Z0-9_]+)$/);
            
            const suggestionsEl = document.getElementById(suggestionsId);
            if (!match) {
                suggestionsEl.classList.add('hidden');
                return;
            }

            const currentToken = match[1];
            // Filter allowed vars (case insensitive match, but display original case)
            const matches = allowedVars.filter(v => v.toLowerCase().startsWith(currentToken.toLowerCase()));

            if (matches.length === 0) {
                suggestionsEl.classList.add('hidden');
                return;
            }

            // Render suggestions
            suggestionsEl.innerHTML = '';
            matches.forEach(variable => {
                const div = document.createElement('div');
                div.className = "px-4 py-2 hover:bg-indigo-50 cursor-pointer text-sm text-slate-700";
                div.textContent = variable;
                div.onmousedown = function(e) {
                    e.preventDefault(); // Prevent input blur
                    applySuggestion(input, variable, currentToken.length);
                    suggestionsEl.classList.add('hidden');
                    // Trigger input event to re-validate
                    input.dispatchEvent(new Event('input'));
                };
                suggestionsEl.appendChild(div);
            });

            suggestionsEl.classList.remove('hidden');
        }

        function applySuggestion(input, variable, tokenLength) {
            const val = input.value;
            const cursorPos = input.selectionStart;
            const textBeforeCursor = val.substring(0, cursorPos);
            const textAfterCursor = val.substring(cursorPos);
            
            // Remove the partial token and insert the full variable
            const newTextBefore = textBeforeCursor.substring(0, textBeforeCursor.length - tokenLength) + variable;
            
            input.value = newTextBefore + textAfterCursor;
            
            // Move cursor to end of inserted variable
            const newCursorPos = newTextBefore.length;
            input.setSelectionRange(newCursorPos, newCursorPos);
            input.focus();
        }

        function validateFormulaStr(formula, allowedVars) {
            if (!formula || formula.trim() === '') return null;

            // 1. Check for invalid characters
            if (/[^a-zA-Z0-9_\+\-\*\/\(\)\.\s]/.test(formula)) {
                return "Formula contains invalid characters. Only letters, numbers, operators (+ - * /), parentheses, and underscores are allowed.";
            }

            // 2. Check parentheses balance
            let balance = 0;
            for (let char of formula) {
                if (char === '(') balance++;
                if (char === ')') balance--;
                if (balance < 0) return "Unbalanced parentheses: too many closing parentheses.";
            }
            if (balance !== 0) return "Unbalanced parentheses: missing closing parentheses.";

            // 3. Check variables
            let tokens = formula.replace(/[\+\-\*\/\(\)]/g, ' ').split(/\s+/);
            
            for (let token of tokens) {
                if (token === '') continue;
                if (!isNaN(token)) continue; // It's a number
                
                let lowerToken = token.toLowerCase();
                if (!allowedVars.includes(lowerToken)) {
                    return "Unknown variable: '" + token + "'. Allowed: " + allowedVars.join(', ');
                }
            }

            return null; // Valid
        }

        function validateInput(inputId, errorId, allowedVars) {
            var input = document.getElementById(inputId);
            var error = document.getElementById(errorId);
            if (!input || !error) return;

            var msg = validateFormulaStr(input.value, allowedVars);
            if (msg) {
                error.textContent = msg;
                error.classList.remove('hidden');
                input.classList.add('ring-2', 'ring-rose-500');
                input.classList.remove('focus:ring-indigo-600');
            } else {
                error.textContent = '';
                error.classList.add('hidden');
                input.classList.remove('ring-2', 'ring-rose-500');
                input.classList.add('focus:ring-indigo-600');
            }
        }

        function simulatePlatformFormula() {
            var form = document.getElementById('add-platform-form');
            var gmvAfterInput = form ? form.querySelector('input[name="gmv_after_support_formula"]') : null;

            var data = new URLSearchParams();
            data.append('_token', '{{ csrf_token() }}');

            var rspInput = document.getElementById('sim_rsp');
            var rsp = 0;
            if (rspInput) {
                var rspRaw = rspInput.value.replace(/[^0-9]/g, '');
                rsp = rspRaw === '' ? 0 : rspRaw;
            }
            var qty = document.getElementById('sim_qty').value || 0;
            var margin = document.getElementById('sim_margin').value || 0;
            var brand_disc = document.getElementById('sim_brand_disc').value || 0;
            var brand_voucher = document.getElementById('sim_brand_voucher').value || 0;
            var member = document.getElementById('sim_member').value || 0;

            // Operators
            // Removed as we use manual input now

            // Parentheses
            // Removed as we use manual input now

            data.append('pricing_rsp_new', rsp);
            data.append('qty', qty);
            data.append('margin', margin);
            data.append('brand_disc', brand_disc);
            data.append('brand_voucher', brand_voucher);
            data.append('member', member);
            
            // Get formula from manual input
            var constructedFormula = document.getElementById('sim_formula_input').value || '';
            
            data.append('gmv_after_support_formula', constructedFormula);
            data.append('simulate', 1);

            fetch('{{ route("settings.channels.simulate") }}', {
                method: 'POST',
                body: data,
                headers: {
                    'X-Requested-With': 'XMLHttpRequest'
                }
            })
            .then(response => response.json())
            .then(data => {
                var resultInput = document.getElementById('sim_result');
                if (data.gmv_after_support !== undefined) {
                    // Format as IDR currency style
                    resultInput.value = new Intl.NumberFormat('id-ID').format(data.gmv_after_support);
                } else {
                    resultInput.value = 'Error';
                }
            })
            .catch(error => {
                console.error('Error:', error);
                document.getElementById('sim_result').value = 'Error';
            });
        }
    </script>
@endcomponent
